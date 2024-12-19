// components/scouts/create-scout-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateScoutForm } from "./create-scout-form";

export function CreateScoutButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Scout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Scout</DialogTitle>
          <DialogDescription>
            Create a new scout to monitor the market for trading signals.
          </DialogDescription>
        </DialogHeader>
        <CreateScoutForm />
      </DialogContent>
    </Dialog>
  );
}
