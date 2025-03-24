"use client";

import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainNav from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/user-nav";
import { Dashboard } from "@/components/dashboard";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { NotificationCenter } from "@/components/notification-center";
import { setActiveTab } from "@/redux/features/uiSlice";
import "prismjs/themes/prism.css";

// Lazy load components
const DocumentEditor = lazy(() => import("@/components/document-editor"));
const Whiteboard = lazy(() => import("@/components/whiteboard"));
const CalendarView = lazy(() => import("@/components/Calender-view"));

export default function Home() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.ui);

  useEffect(() => {
    if (activeTab === "document") {
      import("prismjs").then((Prism) => {
        import("prismjs/components/prism-javascript");
        import("prismjs/components/prism-css");
        import("prismjs/components/prism-python");
        import("prismjs/components/prism-java");
        import("prismjs/components/prism-c");
        import("prismjs/components/prism-cpp");
        import("prismjs/components/prism-csharp");
        import("prismjs/components/prism-markup");
        import("prismjs/components/prism-sql");
        import("prismjs/components/prism-bash");
        import("prismjs/components/prism-json");

        setTimeout(() => {
          Prism.highlightAll();
        }, 100);
      });
    }
  }, [activeTab]);

  const handleTabChange = (value) => {
    dispatch(setActiveTab(value));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20 light">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <NotificationCenter />
            <PomodoroTimer />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="document">Document Editor</TabsTrigger>
                <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Save
                </Button>
                <Button size="sm">Share</Button>
              </div>
            </div>
            <TabsContent value="dashboard" className="space-y-4">
              <Dashboard />
            </TabsContent>
            <TabsContent value="document" className="space-y-4">
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    Loading editor...
                  </div>
                }
              >
                <DocumentEditor />
              </Suspense>
            </TabsContent>
            <TabsContent value="whiteboard" className="space-y-4">
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    Loading whiteboard...
                  </div>
                }
              >
                <Whiteboard />
              </Suspense>
            </TabsContent>
            <TabsContent value="calendar" className="space-y-4">
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    Loading calendar...
                  </div>
                }
              >
                <CalendarView />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
