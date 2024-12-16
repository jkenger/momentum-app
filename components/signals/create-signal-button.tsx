// components/signals/create-signal-button.tsx
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSignalForm } from "./create-signal-form";

export function CreateSignalButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Signal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Signal</DialogTitle>
          <DialogDescription>
            Create a new trading signal with entry, targets, and technical
            analysis.
          </DialogDescription>
        </DialogHeader>
        <CreateSignalForm />
      </DialogContent>
    </Dialog>
  );
}
