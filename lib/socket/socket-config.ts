// lib/socket/socket-config.ts
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export let io: SocketIOServer | undefined;

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}

interface SocketResponse extends NextApiResponse {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
}
