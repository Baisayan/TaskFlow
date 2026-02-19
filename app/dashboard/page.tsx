"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoards } from "@/lib/hooks/useBoards";
import { Board } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import { Filter, Plus, Search, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, updateBoard, deleteBoard, boards, loading, error } =
    useBoards();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
  });

  const [newBoard, setNewBoard] = useState({
    title: "",
    description: "",
    color: "bg-blue-500",
  });

  const [editBoard, setEditBoard] = useState({
    title: "",
    description: "",
    color: "bg-blue-500",
  });

  const filteredBoards = useMemo(() => {
    return boards.filter((board: Board) => {
      const matchesSearch = board.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const boardDate = new Date(board.updated_at).toDateString();

      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start).toDateString()
        : null;

      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end).toDateString()
        : null;

      const matchesDateRange =
        (!startDate || new Date(boardDate) >= new Date(startDate)) &&
        (!endDate || new Date(boardDate) <= new Date(endDate));

      return matchesSearch && matchesDateRange;
    });
  }, [boards, filters]);

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null,
        end: null,
      },
    });
  }

  const handleCreateBoard = async () => {
    if (!newBoard.title.trim()) return;

    await createBoard({
      title: newBoard.title.trim(),
      description: newBoard.description.trim() || undefined,
      color: newBoard.color,
    });

    setNewBoard({
      title: "",
      description: "",
      color: "bg-blue-500",
    });
    setIsCreateOpen(false);
  };

  const handleOpenEditDialog = (board: Board) => {
    setActiveBoard(board);
    setEditBoard({
      title: board.title,
      description: board.description ?? "",
      color: board.color,
    });
    setIsEditOpen(true);
  };

  const handleUpdateBoard = async () => {
    if (!activeBoard || !editBoard.title.trim()) return;

    await updateBoard(activeBoard.id, {
      title: editBoard.title.trim(),
      description: editBoard.description.trim() || undefined,
      color: editBoard.color,
    });

    setIsEditOpen(false);
    setActiveBoard(null);
  };

  const handleDeleteBoard = async () => {
    if (!activeBoard) return;

    await deleteBoard(activeBoard.id);
    setIsEditOpen(false);
    setActiveBoard(null);
  };

  if (loading && boards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2> Error loading boards</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Your workspace awaits,{" "}
                <span className="text-primary">
                  {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </span>
              </h2>
              <p className="text-muted-foreground px-1">
                Manage your projects and tasks in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter /> Filter
              </Button>

              <Button onClick={() => setIsCreateOpen(true)} size="lg">
                <Plus strokeWidth={3} />
                Create
              </Button>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-primary" />
            <Input
              id="search"
              placeholder="Search boards..."
              className="pl-10 border-2"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {boards.length === 0 ? (
            <div className="px-1">No boards yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
              {filteredBoards.map((board) => (
                <Link href={`/boards/${board.id}`} key={board.id}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-4 ${board.color} rounded`} />
                          <CardTitle className="text-lg sm:text-xl truncate">
                            {board.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenEditDialog(board);
                          }}
                        >
                          <MoreVertical />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <CardDescription className="text-md mb-3 line-clamp-2">
                        {board.description?.trim()
                          ? board.description
                          : "No description"}
                      </CardDescription>
                      <div className="flex justify-end pr-3 text-muted-foreground">
                        Last Updated{" "}
                        {new Date(board.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card onClick={() => setIsCreateOpen(true)}>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <Plus className="size-6 sm:size-8 mb-2" />
                  <p className="text-sm sm:text-base font-medium">
                    Create New Board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto border-2">
          <DialogHeader>
            <DialogTitle>Edit board</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Edit or delete your boards as per your needs.
            </p>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateBoard();
            }}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editBoard.title}
                onChange={(e) =>
                  setEditBoard((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editBoard.description}
                onChange={(e) =>
                  setEditBoard((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2 justify-items-center">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-orange-500",
                  "bg-cyan-500",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setEditBoard((prev) => ({ ...prev, color: c }))
                    }
                    className={`size-8 rounded-full ${c} ${
                      editBoard.color === c ? "ring-3" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={handleDeleteBoard}
              >
                Delete board
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  type="button"
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

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto border-2">
          <DialogHeader>
            <DialogTitle>Filter Boards</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Filter boards by title or last updated date.
            </p>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsFilterOpen(false);
            }}
          >
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search board titles..."
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs pl-1">Start Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs pl-1">End Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto border-2">
          <DialogHeader>
            <DialogTitle>Create new board</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Create a new board to manage your tasks.
            </p>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateBoard();
            }}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. First Project"
                value={newBoard.title}
                onChange={(e) =>
                  setNewBoard((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Optional"
                value={newBoard.description}
                onChange={(e) =>
                  setNewBoard((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2 justify-items-center">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-orange-500",
                  "bg-cyan-500",
                ].map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setNewBoard((prev) => ({ ...prev, color }))}
                    className={`size-8 rounded-full ${color} ${
                      newBoard.color === color ? "ring-3" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newBoard.title.trim()}>
                Create board
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
