"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  SearchCheck,
  ArrowLeftRight,
  ShieldCheck,
  ArrowRight,
  Medal,
  GraduationCap,
  Code2,
  Briefcase,
  User,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import Navbar from "@/components/navbar";

export default function HomePage() {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: LayoutDashboard,
      title: "Clear Visual Workflow",
      description:
        "Create unlimited boards. Structure your workflow the way you work - simple and designed for clarity.",
    },
    {
      icon: SearchCheck,
      title: "Find What Matters Instantly",
      description:
        "Quickly locate tasks across boards using smart search and filters, helping you focus only on what matters.",
    },
    {
      icon: ArrowLeftRight,
      title: "Adapt to Any Workflow",
      description:
        "Move tasks between stages, reorder them with ease, rename them and create as many boards needed.",
    },
    {
      icon: ShieldCheck,
      title: "Always in Sync & Secure",
      description:
        "Enterprise-grade security to protect your data with instantaneous realtime-sync to keep you updated.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mx-auto mb-4 w-fit flex items-center border shadow-sm p-4 rounded-full font-bold uppercase gap-2">
            <Medal className="size-6 text-primary" />
            built for management & clarity
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Modern Way to Stay <span className="text-primary">Organized</span> -
            Task
            <span className="text-primary">Flow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plan projects, organize tasks, track progress, and streamline your
            workflow with fast, flexible Kanban system. From daily planning to
            long-term goals, TaskFlow adapts to how you work, helps stay
            organized, focused, and ahead.
          </p>

          {!isSignedIn ? (
            <div className="flex flex-row gap-4 justify-center">
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg">
                  Explore Features
                </Button>
              </a>
              <SignUpButton>
                <Button size="lg" className="text-lg px-8">
                  Start for free
                  <ArrowRight className="size-5" />
                </Button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center">
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg">
                  Explore Features
                </Button>
              </a>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Go to DashBoard
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help your team collaborate and get more done.
          </p>
        </div>

        <div className="grid grid-cols-2 mx-auto max-w-4xl gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="gap-4">
              <CardHeader className="text-center">
                <div className="mx-auto size-16 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <feature.icon className="size-8 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-3 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-6 justify-between">
            <div className="flex items-center space-x-2">
              <Logo className="size-6 text-primary" />
              <span className="text-xl font-bold">
                Task<span className="text-primary">Flow</span>
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-center text-sm">
              <span>© 2025 TaskFlow.</span>
              <span>Built with ❤️ by Ved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
