"use client";

import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Trash2,
  Image,
  Triangle,
  Star,
  Save,
  Share2,
  Users,
  LayoutTemplate,
  ArrowUpRight,
  Hexagon,
  Minus,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { WhiteboardTemplates } from "@/components/whiteboard-templates";
import {
  saveWhiteboard,
  updateWhiteboard,
} from "@/redux/features/whiteboardSlice";
import { addNotification } from "@/redux/features/notificationsSlice";

function Whiteboard() {
  const dispatch = useDispatch();
  const { currentWhiteboard } = useSelector((state) => state.whiteboard);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState([2]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const [title, setTitle] = useState("Untitled Whiteboard");
  const [showTemplates, setShowTemplates] = useState(false);
  const [lineStyle, setLineStyle] = useState("solid");
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "John Doe", color: "#FF5733", active: true },
    { id: 2, name: "Jane Smith", color: "#33FF57", active: false },
  ]);

  useEffect(() => {
    if (currentWhiteboard) {
      setTitle(currentWhiteboard.title || "Untitled Whiteboard");
      // In a real app, we would load the whiteboard data here
    }
  }, [currentWhiteboard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 600; // Fixed height or you could make it responsive too

        // Restore the canvas content after resize
        if (historyIndex >= 0 && history[historyIndex]) {
          ctx.putImageData(history[historyIndex], 0, 0);
        } else {
          // Clear canvas with white background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Save initial state
          saveState();
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [history, historyIndex]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // If we're not at the end of the history array, remove everything after current index
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }

    setHistory([...history, imageData]);
    setHistoryIndex(historyIndex + 1);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    if (tool === "text") {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = size[0];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (lineStyle === "dashed") {
      ctx.setLineDash([5, 5]);
    } else if (lineStyle === "dotted") {
      ctx.setLineDash([2, 2]);
    } else {
      ctx.setLineDash([]);
    }

    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "pencil" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "square") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      ctx.beginPath();
      ctx.rect(lastX, lastY, x - lastX, y - lastY);
      ctx.stroke();
    } else if (tool === "circle") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      const radius = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      ctx.beginPath();
      ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === "triangle") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineTo(lastX - (x - lastX), y);
      ctx.closePath();
      ctx.stroke();
    } else if (tool === "star") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      const radius = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      drawStar(ctx, lastX, lastY, 5, radius / 2, radius);
      ctx.stroke();
    } else if (tool === "hexagon") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      const radius = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      drawPolygon(ctx, lastX, lastY, 6, radius);
      ctx.stroke();
    } else if (tool === "line") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "arrow") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }

      drawArrow(ctx, lastX, lastY, x, y);
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawStar = (ctx, cx, cy, spikes, innerRadius, outerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const drawPolygon = (ctx, cx, cy, sides, radius) => {
    ctx.beginPath();
    ctx.moveTo(cx + radius * Math.cos(0), cy + radius * Math.sin(0));

    for (let i = 1; i <= sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }

    ctx.closePath();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const addText = () => {
    if (!text) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${size[0] * 8}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, textPosition.x, textPosition.y);

    setText("");
    setShowTextInput(false);
    saveState();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    saveState();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = dataURL;
    link.click();

    dispatch(
      addNotification({
        id: Date.now(),
        title: "Whiteboard Exported",
        message: `"${title}" has been exported as PNG.`,
        type: "success",
      })
    );
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");

    dispatch(
      saveWhiteboard({
        id: currentWhiteboard?.id,
        title,
        thumbnail: dataURL,
      })
    );

    dispatch(
      addNotification({
        id: Date.now(),
        title: "Whiteboard Saved",
        message: `"${title}" has been saved successfully.`,
        type: "success",
      })
    );
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    dispatch(
      updateWhiteboard({
        id: currentWhiteboard?.id,
        title: e.target.value,
      })
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw the image at the center of the canvas
        const x = (canvas.width - img.width) / 2;
        const y = (canvas.height - img.height) / 2;
        ctx.drawImage(img, x, y);

        saveState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const generateAIDiagram = () => {
    // This would be connected to an actual AI service in a real implementation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple diagram (this is just a placeholder)
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;

    // Draw boxes
    ctx.strokeRect(100, 100, 150, 80);
    ctx.strokeRect(350, 100, 150, 80);
    ctx.strokeRect(225, 250, 150, 80);

    // Draw arrows
    drawArrow(ctx, 250, 140, 350, 140);
    drawArrow(ctx, 300, 180, 300, 250);

    // Add text
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText("Input", 150, 140);
    ctx.fillText("Process", 400, 140);
    ctx.fillText("Output", 275, 290);

    saveState();

    dispatch(
      addNotification({
        id: Date.now(),
        title: "AI Diagram Generated",
        message: "AI has generated a new diagram on your whiteboard.",
        type: "info",
      })
    );
  };

  const applyTemplate = (templateId) => {
    // In a real app, this would load a predefined template
    clearCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Example template: Mind Map
    if (templateId === "mindmap") {
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;

      // Center node
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
      ctx.stroke();

      // Branches
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x1 = canvas.width / 2 + 50 * Math.cos(angle);
        const y1 = canvas.height / 2 + 50 * Math.sin(angle);
        const x2 = canvas.width / 2 + 150 * Math.cos(angle);
        const y2 = canvas.height / 2 + 150 * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2, y2, 30, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    // Example template: Kanban Board
    else if (templateId === "kanban") {
      const columnWidth = canvas.width / 3;

      // Draw columns
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;

      // To Do column
      ctx.strokeRect(10, 50, columnWidth - 20, canvas.height - 100);
      ctx.font = "20px sans-serif";
      ctx.fillText("To Do", 20, 30);

      // In Progress column
      ctx.strokeRect(
        columnWidth + 10,
        50,
        columnWidth - 20,
        canvas.height - 100
      );
      ctx.fillText("In Progress", columnWidth + 20, 30);

      // Done column
      ctx.strokeRect(
        columnWidth * 2 + 10,
        50,
        columnWidth - 20,
        canvas.height - 100
      );
      ctx.fillText("Done", columnWidth * 2 + 20, 30);

      // Example cards
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(20, 70, columnWidth - 40, 80);
      ctx.fillRect(20, 170, columnWidth - 40, 80);
      ctx.fillRect(columnWidth + 20, 70, columnWidth - 40, 80);
      ctx.fillRect(columnWidth * 2 + 20, 70, columnWidth - 40, 80);
      ctx.fillRect(columnWidth * 2 + 20, 170, columnWidth - 40, 80);
    }

    saveState();
    setShowTemplates(false);

    dispatch(
      addNotification({
        id: Date.now(),
        title: "Template Applied",
        message: "Template has been applied to your whiteboard.",
        type: "success",
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {showTemplates && (
        <div className="md:col-span-1">
          <WhiteboardTemplates
            onSelectTemplate={applyTemplate}
            onClose={() => setShowTemplates(false)}
          />
        </div>
      )}

      <Card
        className={`border shadow-sm ${
          showTemplates ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <LayoutTemplate className="h-4 w-4" />
              </Button>
              <Input
                value={title}
                onChange={handleTitleChange}
                className="font-medium text-lg"
                placeholder="Whiteboard Title"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCanvas}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Users className="h-4 w-4" />
                Collaborate
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "pencil" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("pencil")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pencil</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "line" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("line")}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Line</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "arrow" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("arrow")}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Arrow</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "square" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("square")}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Square</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "circle" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("circle")}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Circle</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "triangle" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("triangle")}
                    >
                      <Triangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Triangle</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "hexagon" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("hexagon")}
                    >
                      <Hexagon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hexagon</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "star" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("star")}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Star</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "text" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("text")}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Text</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={tool === "eraser" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setTool("eraser")}
                    >
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eraser</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-8 p-0 border-0"
              />
              <div className="w-32">
                <Slider
                  value={size}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={setSize}
                />
              </div>
              <Select value={lineStyle} onValueChange={setLineStyle}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Line Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative border rounded-md bg-white">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            />

            {showTextInput && (
              <div
                className="absolute bg-white border rounded p-2"
                style={{ left: textPosition.x, top: textPosition.y + 20 }}
              >
                <div className="flex flex-col space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={addText}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTextInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Collaborator cursors (simulated) */}
            {collaborators
              .filter((c) => c.active)
              .map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="absolute pointer-events-none flex flex-col items-start"
                  style={{
                    left: Math.random() * 500,
                    top: Math.random() * 400,
                    transition: "all 0.5s ease",
                  }}
                >
                  <div
                    className="w-4 h-4 transform rotate-45"
                    style={{ backgroundColor: collaborator.color }}
                  ></div>
                  <span
                    className="text-xs px-1 rounded mt-1"
                    style={{
                      backgroundColor: collaborator.color,
                      color: "white",
                    }}
                  >
                    {collaborator.name}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo2 className="h-4 w-4" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo2 className="h-4 w-4" />
                Redo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive"
                onClick={clearCanvas}
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={generateAIDiagram}
              >
                <Sparkles className="h-4 w-4" />
                AI Diagram
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Whiteboard;
