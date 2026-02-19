"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/supabase/models";
import { Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function SortableTask({
  task,
  onUpdateTask,
  onDeleteTask,
}: {
  task: Task;
  onUpdateTask: (
    taskId: string,
    updates: {
      title?: string;
      description?: string | null;
      priority?: "low" | "medium" | "high";
      dueDate?: string | null;
    },
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const PRIORITY_COLOR_MAP: Record<Task["priority"], string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");

  function openEdit() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setDueDate(task.due_date ?? "");
    setIsEditOpen(true);
  }

  return (
    <>
      <div ref={setNodeRef} style={styles} {...listeners} {...attributes}>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm flex-1 truncate pr-2">
                  {task.title}
                </h4>

                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit();
                  }}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                  {task.due_date && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar
                        className={`size-3 ${
                          isOverdue ? "text-red-500 font-medium" : ""
                        }`}
                      />
                      <span
                        className={`truncate ${
                          isOverdue ? "text-red-500 font-medium" : ""
                        }`}
                      >
                        {task.due_date}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={`size-3 mr-2 rounded-full shrink-0 ${
                    PRIORITY_COLOR_MAP[task.priority]
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto border-2">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await onUpdateTask(task.id, {
                title: title.trim(),
                description: description.trim() || null,
                priority,
                dueDate: dueDate || null,
              });
              setIsEditOpen(false);
            }}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as Task["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high"].map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  await onDeleteTask(task.id);
                  setIsEditOpen(false);
                }}
              >
                Delete
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
