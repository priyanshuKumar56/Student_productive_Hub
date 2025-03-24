"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function WhiteboardTemplates({ onSelectTemplate, onClose }) {
  const templates = [
    {
      id: "blank",
      title: "Blank Canvas",
      description: "Start with a clean slate",
      category: "basic",
    },
    {
      id: "mindmap",
      title: "Mind Map",
      description: "Organize ideas and concepts",
      category: "education",
    },
    {
      id: "kanban",
      title: "Kanban Board",
      description: "Track tasks and progress",
      category: "productivity",
    },
    {
      id: "flowchart",
      title: "Flowchart",
      description: "Map out processes and decisions",
      category: "business",
    },
    {
      id: "concept",
      title: "Concept Map",
      description: "Connect related concepts",
      category: "education",
    },
    {
      id: "brainstorm",
      title: "Brainstorming",
      description: "Generate and organize ideas",
      category: "creativity",
    },
  ]

  return (
    <div className="p-4 border rounded-md h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Templates</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates" className="pl-8" />
      </div>

      <div className="grid gap-2">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm">{template.title}</CardTitle>
              <CardDescription className="text-xs">{template.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

