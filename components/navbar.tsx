"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import { Logo } from "./logo";

interface Props {
  boardTitle?: string;
  onEditBoard?: () => void;

  onFilterClick?: () => void;
  filterCount?: number;
}

export default function Navbar({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: Props) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/boards/");

  if (isDashboardPage) {
    return (
      <header className="border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="size-6 sm:size-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold">
              Task<span className="text-primary">Flow</span>
            </span>
          </div>

          <div className="flex items-center">
            <UserButton />
          </div>
        </div>
      </header>
    );
  }

  if (isBoardPage) {
    return (
      <header className="border-b border-purple-300 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 min-w-0">
              <Logo className="h-5 w-5 text-purple-500 shrink-0" />

              <span className="text-base sm:text-lg font-bold text-gray-900 truncate max-w-full">
                {boardTitle}
              </span>

              {onEditBoard && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 shrink-0 hover:bg-purple-100"
                  onClick={onEditBoard}
                >
                  <MoreHorizontal className="h-4 w-4 text-purple-600" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-end">
              {onFilterClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`border-2 border-purple-500 text-purple-500 hover:bg-purple-100 hover:border-purple-600 hover:text-purple-600 ${
                    filterCount > 0 ? "bg-purple-100" : ""
                  }`}
                  onClick={onFilterClick}
                >
                  <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                  {filterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs bg-purple-50 border-purple-500"
                    >
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo className="size-6 sm:size-8 text-primary" />
          <span className="text-xl sm:text-2xl font-bold">
            Task<span className="text-primary">Flow</span>
          </span>
        </div>

        <div className="flex items-center">
          {isSignedIn ? (
            <div className="flex flex-row items-center space-x-4">
              <span className="text-primary hidden sm:block">
                Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
              </span>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="text-sm"
                >
                  Go to Dashboard <ArrowRight />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-2">
              <SignInButton>
                <Button
                  variant="outline"
                  className="text-sm"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="text-sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
