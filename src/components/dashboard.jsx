"use client";

import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  PenTool,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import {
  createNewDocument,
  createNewWhiteboard,
  deleteDocument,
  deleteWhiteboard,
} from "@/redux/features/dashboardSlice";
import { setActiveTab } from "@/redux/features/uiSlice";
import { setCurrentDocument } from "@/redux/features/documentsSlice";
import { setCurrentWhiteboard } from "@/redux/features/whiteboardSlice";
import { useEffect } from "react";

export const Dashboard = memo(function Dashboard() {
  const dispatch = useDispatch();
  const { documents, whiteboards, recentItems, stats } = useSelector(
    (state) => state.dashboard
  );

  const [view, setView] = useState("recent");

  const handleNewDocument = useCallback(() => {
    dispatch(createNewDocument());
    dispatch(setActiveTab("document"));
  }, [dispatch]);

  const handleNewWhiteboard = useCallback(() => {
    dispatch(createNewWhiteboard());
    dispatch(setActiveTab("whiteboard"));
  }, [dispatch]);

  const handleDeleteDocument = useCallback(
    (id) => {
      dispatch(deleteDocument(id));
    },
    [dispatch]
  );

  const handleDeleteWhiteboard = useCallback(
    (id) => {
      dispatch(deleteWhiteboard(id));
    },
    [dispatch]
  );

  const handleOpenItem = useCallback(
    (item) => {
      if (item.type === "document") {
        const document = documents.find((doc) => doc.id === item.id);
        if (document) {
          dispatch(setCurrentDocument(item.id));
          dispatch(setActiveTab("document"));
        }
      } else if (item.type === "whiteboard") {
        const whiteboard = whiteboards.find((wb) => wb.id === item.id);
        if (whiteboard) {
          dispatch(setCurrentWhiteboard(item.id));
          dispatch(setActiveTab("whiteboard"));
        }
      }
    },
    [dispatch, documents, whiteboards]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleNewDocument}>
            <Plus className="mr-2 h-4 w-4" /> New Document
          </Button>
          <Button onClick={handleNewWhiteboard}>
            <Plus className="mr-2 h-4 w-4" /> New Whiteboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentItems.length}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newDocumentsThisWeek} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Whiteboards
            </CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whiteboards.length}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newWhiteboardsThisWeek} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyHours}h</div>
            <p className="text-xs text-muted-foreground">
              +{stats.studyHoursIncrease}% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.goalCompletion}%</div>
            <Progress value={stats.goalCompletion} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={view} onValueChange={setView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">
            <Clock className="mr-2 h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="whiteboards">
            <PenTool className="mr-2 h-4 w-4" />
            Whiteboards
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <h3 className="text-lg font-medium">Recently Edited</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <CardDescription>
                    {item.type === "document" ? "Document" : "Whiteboard"} •{" "}
                    {item.lastEdited}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                    {item.type === "document" ? (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <PenTool className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Star className="mr-2 h-4 w-4" />
                    Favorite
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenItem(item)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <h3 className="text-lg font-medium">All Documents</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {doc.title}
                  </CardTitle>
                  <CardDescription>Document • {doc.lastEdited}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleOpenItem({ id: doc.id, type: "document" })
                    }
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whiteboards" className="space-y-4">
          <h3 className="text-lg font-medium">All Whiteboards</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whiteboards.map((board) => (
              <Card key={board.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {board.title}
                  </CardTitle>
                  <CardDescription>
                    Whiteboard • {board.lastEdited}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                    <PenTool className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleOpenItem({ id: board.id, type: "whiteboard" })
                    }
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWhiteboard(board.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <h3 className="text-lg font-medium">Study Schedule</h3>
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-muted-foreground p-8">
                Calendar view will be implemented soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});
