"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/supabase/models";
import { Calendar } from "lucide-react";

export default function TaskOverlay({ task }: { task: Task }) {
  const PRIORITY_COLOR_MAP: Record<Task["priority"], string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex-1 truncate pr-2">
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground">{task.description}</p>
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
  );
}
