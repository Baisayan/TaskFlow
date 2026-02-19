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
      <header className="border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button size="sm">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 min-w-0">
              <Logo className="size-5 text-primary shrink-0" />

              <span className="text-base sm:text-lg font-bold truncate max-w-full">
                {boardTitle}
              </span>

              {onEditBoard && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-7 shrink-0"
                  onClick={onEditBoard}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-end">
              {onFilterClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFilterClick}
                >
                  <Filter className="size-4 mr-1" />
                  <span className="hidden sm:inline">Filter</span>
                  {filterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs bg-accent"
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
              <span className="hidden sm:block">
                Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
              </span>
              <Link href="/dashboard">
                <Button size="sm" className="text-sm">
                  Go to Dashboard <ArrowRight />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-2">
              <SignInButton>
                <Button variant="outline" className="text-sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="text-sm">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
