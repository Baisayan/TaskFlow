"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus } from "lucide-react";

export default function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (
    columnId: string,
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      className="w-full md:max-w-xl lg:mx-0 lg:shrink-0 lg:w-80"
    >
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate">
                {column.title}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => onEditColumn(column)}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        <div className="p-3">
          {children}
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full mt-3"
                onClick={() => setIsCreateTaskOpen(true)}
              >
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto border-2">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Add a task to the board
                </p>
              </DialogHeader>

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  await onCreateTask(column.id, e);
                  setIsCreateTaskOpen(false);
                }}
              >
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high"].map((priority, key) => (
                        <SelectItem key={key} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>

                <div className="flex flex-col sm:flex-row justify-end">
                  <Button type="submit" disabled={!column}>
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
