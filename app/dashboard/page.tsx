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
import {
  Filter,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, boards, error } = useBoards();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
  });

  const filteredBoards = boards.filter((board: Board) => {
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

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null as string | null,
        end: null as string | null,
      },
    });
  }

  const handleCreateBoard = async () => {
    await createBoard({ title: "New Board" });
  };

  if (error) {
    return (
      <div>
        <h2> Error loading boards</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-fixed min-h-screen bg-radial from-white to-purple-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Your workspace awaits,{" "}
                <span className="text-purple-500">
                  {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </span>
              </h2>
              <p className="text-purple-600 px-1">
                Manage your projects and tasks in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                variant="ghost"
                size="lg"
                className="border border-purple-300 text-purple-500 bg-white hover:bg-purple-100 hover:border-purple-600 hover:text-purple-600"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter /> Filter
              </Button>

              <Button
                onClick={handleCreateBoard}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus strokeWidth={3} />
                Create
              </Button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
            <Input
              id="search"
              placeholder="Search boards..."
              className="pl-10 border border-purple-300 bg-white text-purple-500 placeholder:text-purple-500 focus-visible:ring-purple-200 focus-visible:border-purple-300"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {/* All Boards display */}
          {boards.length === 0 ? (
            <div className="px-1 text-purple-600">No boards yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
              {filteredBoards.map((board, key) => (
                <Link href={`/boards/${board.id}`} key={key}>
                  <Card className="h-full hover:shadow-lg hover:shadow-purple-200 transition-shadow cursor-pointer group border-purple-300 hover:border-purple-400">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${board.color} rounded`} />
                          <CardTitle className="text-lg sm:text-xl text-purple-600 truncate">
                            {board.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 rounded-full hover:bg-purple-100"
                        >
                          <MoreVertical className="text-purple-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <CardDescription className="text-md mb-4 line-clamp-2 min-h-12">
                        {board.description?.trim()
                          ? board.description
                          : "No description"}
                      </CardDescription>
                      <div className="flex text-sm text-gray-600">
                        Updated{" "}
                        {new Date(board.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card className="border border-purple-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2" />
                  <p className="text-sm sm:text-base text-purple-600 font-medium">
                    Create New Board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent
          className="w-[95vw] max-w-[425px] mx-auto border-2 border-purple-300 bg-purple-50 [&>button]:text-purple-600 [&>button:hover]:text-purple-700 [&>button:hover]:bg-purple-100 [&>button]:rounded-md"
        >
          <DialogHeader>
            <DialogTitle className="text-purple-700">Filter Boards</DialogTitle>
            <p className="text-sm text-purple-600">
              Filter boards by title, last updated date, or task count.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search by title */}
            <div className="space-y-2">
              <Label className="text-purple-700">Search</Label>
              <Input
                id="search"
                placeholder="Search board titles..."
                className="border-purple-300 bg-white text-purple-600 placeholder:text-purple-500 focus-visible:ring-purple-200 focus-visible:border-purple-300"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            {/* Search by date */}
            <div className="space-y-2">
              <Label className="text-purple-700">Date Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-purple-700">Start Date</Label>
                  <Input
                    type="date"
                    className="border-purple-300 bg-white text-purple-600 focus-visible:ring-purple-200 focus-visible:border-purple-300"
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
                  <Label className="text-xs text-purple-700">End Date</Label>
                  <Input
                    type="date"
                    className="border-purple-300 bg-white text-purple-600 focus-visible:ring-purple-200 focus-visible:border-purple-300"
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
            
            {/* Buttons apply n clear */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
              <Button
                variant="ghost"
                className="border border-purple-300 text-purple-500 bg-white hover:bg-purple-100 hover:border-purple-600 hover:text-purple-600"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
