// app/api/signals/stream/route.ts
import { NextRequest } from "next/server";

const clients = new Set<ReadableStreamController<any>>();

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);
      console.log("Client connected, total clients:", clients.size);

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));
    },
    cancel(controller) {
      clients.delete(controller);
      console.log("Client disconnected, remaining clients:", clients.size);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Helper function to broadcast updates to all clients
export function broadcastSignal(data: any) {
  const encoder = new TextEncoder();
  const message = `data: ${JSON.stringify(data)}\n\n`;

  console.log("Broadcasting to", clients.size, "clients:", message);

  clients.forEach((client) => {
    try {
      client.enqueue(encoder.encode(message));
    } catch (error) {
      console.error("Error sending to client:", error);
      clients.delete(client);
    }
  });
}
