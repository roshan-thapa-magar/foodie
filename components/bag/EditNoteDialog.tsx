"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditNoteDialogProps {
  open: boolean;
  note?: string;
  loading?: boolean;
  onClose: () => void;
  onSave: (note: string) => Promise<void>;
}

const EditNoteDialog = ({
  open,
  note,
  loading,
  onClose,
  onSave,
}: EditNoteDialogProps) => {
  const [noteValue, setNoteValue] = useState("");

  // Update noteValue when the note prop changes or dialog opens
  useEffect(() => {
    if (open) {
      setNoteValue(note || "");
    }
  }, [note, open]);

  const handleSave = async () => {
    await onSave(noteValue);
  };

  const handleClose = () => {
    setNoteValue(""); // Reset when closing
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>

        <textarea
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          placeholder="Add special instructions..."
          className="w-full min-h-[100px] border rounded-md p-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          rows={4}
          autoFocus
        />

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Note"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;