"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditorSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  onSave: (name: string) => void;
}

interface EditorSaveDialogFormProps {
  defaultName: string;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
}

function EditorSaveDialogForm({
  defaultName,
  onOpenChange,
  onSave,
}: EditorSaveDialogFormProps) {
  const [value, setValue] = useState(defaultName);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    onSave(trimmedValue);
    onOpenChange(false);
  };

  return (
    <>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter a snapshot name"
      />
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!value.trim()}>
          Save Snapshot
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditorSaveDialog({
  open,
  onOpenChange,
  defaultName,
  onSave,
}: EditorSaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Edited Asset</DialogTitle>
        <DialogDescription>
          Save the current editor state as a reusable snapshot.
        </DialogDescription>
        </DialogHeader>
        {open ? (
          <EditorSaveDialogForm
            key={defaultName}
            defaultName={defaultName}
            onOpenChange={onOpenChange}
            onSave={onSave}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
