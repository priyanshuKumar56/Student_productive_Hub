"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Languages,
  FileText,
  Download,
  Save,
  Share2,
  FolderPlus,
  CheckSquare,
  FileQuestion,
  Braces,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Highlighter,
  Palette,
  Trash2,
  Code,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DocumentFolders } from "@/components/document-folders";
import {
  updateDocument,
  saveDocument,
  createNewDocument,
} from "@/redux/features/documentsSlice";
import { addNotification } from "@/redux/features/notificationsSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { memo } from "react";

const DocumentEditor = memo(function DocumentEditor() {
  const dispatch = useDispatch();
  const { currentDocument, documents, folders } = useSelector(
    (state) => state.documents
  );
  const editorRef = useRef(null);

  const [title, setTitle] = useState("Untitled Document");
  const [showFolders, setShowFolders] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "editor" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "viewer" },
  ]);
  const [newCollaborator, setNewCollaborator] = useState({
    email: "",
    role: "viewer",
  });
  const [editorState, setEditorState] = useState({
    selection: null,
    format: {
      bold: false,
      italic: false,
      underline: false,
      heading: null,
      align: "left",
      list: null,
    },
  });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#ffff00");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Initialize editor with content when document changes
  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title || "Untitled Document");

      if (editorRef.current) {
        editorRef.current.innerHTML = currentDocument.content || "";
        updateCounts();
      }
    } else {
      setTitle("Untitled Document");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        updateCounts();
      }
    }
  }, [currentDocument]);

  // Update word and character counts
  const updateCounts = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setCharCount(text.length);
      setWordCount(text.split(/\s+/).filter(Boolean).length);
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (currentDocument) {
      dispatch(
        updateDocument({
          id: currentDocument.id,
          title: e.target.value,
        })
      );
    }
  };

  // Save document
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;

      dispatch(
        saveDocument({
          id: currentDocument?.id,
          title,
          content,
        })
      );

      dispatch(
        addNotification({
          id: Date.now(),
          title: "Document Saved",
          message: `"${title}" has been saved successfully.`,
          type: "success",
        })
      );
    }
  };

  // Create new document
  const handleNewDocument = () => {
    dispatch(createNewDocument());
  };

  // Export document
  const handleExport = () => {
    // In a real app, this would generate and download the document
    dispatch(
      addNotification({
        id: Date.now(),
        title: "Document Exported",
        message: `"${title}" has been exported as ${exportFormat.toUpperCase()}.`,
        type: "success",
      })
    );
  };

  // Handle editor input
  const handleEditorInput = () => {
    if (editorRef.current) {
      // Save to undo stack
      setUndoStack((prev) => [...prev, editorRef.current.innerHTML]);
      // Clear redo stack on new input
      setRedoStack([]);

      // Update document in Redux
      if (currentDocument) {
        dispatch(
          updateDocument({
            id: currentDocument.id,
            content: editorRef.current.innerHTML,
          })
        );
      }

      updateCounts();
    }
  };

  // Handle editor selection change
  const handleSelectionChange = () => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      setEditorState((prev) => ({
        ...prev,
        selection: selection.getRangeAt(0),
      }));

      // Detect formatting
      const parentElement = selection.anchorNode?.parentElement;

      if (parentElement) {
        const isBold = document.queryCommandState("bold");
        const isItalic = document.queryCommandState("italic");
        const isUnderline = document.queryCommandState("underline");

        // Detect heading
        let heading = null;
        if (parentElement.tagName === "H1" || parentElement.closest("h1")) {
          heading = "h1";
        } else if (
          parentElement.tagName === "H2" ||
          parentElement.closest("h2")
        ) {
          heading = "h2";
        } else if (
          parentElement.tagName === "H3" ||
          parentElement.closest("h3")
        ) {
          heading = "h3";
        }

        // Detect alignment
        let align = "left";
        if (
          parentElement.style.textAlign === "center" ||
          parentElement.closest('[style*="text-align: center"]')
        ) {
          align = "center";
        } else if (
          parentElement.style.textAlign === "right" ||
          parentElement.closest('[style*="text-align: right"]')
        ) {
          align = "right";
        }

        // Detect list
        let list = null;
        if (parentElement.tagName === "LI" || parentElement.closest("li")) {
          const ulParent = parentElement.closest("ul");
          const olParent = parentElement.closest("ol");

          if (ulParent) {
            list = "bullet";
          } else if (olParent) {
            list = "ordered";
          }
        }

        setEditorState((prev) => ({
          ...prev,
          format: {
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            heading,
            align,
            list,
          },
        }));
      }
    }
  };

  // Execute command on selection
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleSelectionChange();
    handleEditorInput();
  };

  // Add a new function for handling code blocks with syntax highlighting
  const formatCodeBlock = () => {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      // Get the selected text
      let text = "";
      if (!selection.isCollapsed) {
        text = selection.toString();
      }

      // If there's no text selected, prompt the user to enter code
      if (!text.trim()) {
        text = prompt("Enter your code:", "");
        if (!text) return;
      }

      // Create a pre and code element with automatic language detection
      const codeHTML = `<pre><code class="language-plaintext">${text}</code></pre>`;

      // Insert the code block
      execCommand("insertHTML", codeHTML);

      // Notify about the code block
      dispatch(
        addNotification({
          id: Date.now(),
          title: "Code Block Added",
          message: "Code block has been added to your document.",
          type: "success",
        })
      );
    }
  };

  // Add this new function to handle code paste events
  const handlePaste = (e) => {
    // Check if the paste content might be code (contains multiple lines or special characters)
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text");

    // Simple heuristic to detect if the pasted content might be code
    const hasMultipleLines = pastedText.includes("\n");
    const hasBraces = /[{}[\]()<>]/.test(pastedText);
    const hasIndentation = /^ {2,}|\t/.test(pastedText);
    const hasProgrammingKeywords =
      /(function|class|import|export|const|let|var|if|else|for|while|return|try|catch)/.test(
        pastedText
      );

    if (
      (hasMultipleLines && (hasBraces || hasIndentation)) ||
      hasProgrammingKeywords
    ) {
      // This looks like code, prevent default paste and insert as code block
      e.preventDefault();

      // Create a code block with the pasted content
      const sanitizedCode = pastedText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      const codeHTML = `<pre><code class="language-plaintext">${sanitizedCode}</code></pre>`;

      // Insert at cursor position
      execCommand("insertHTML", codeHTML);

      dispatch(
        addNotification({
          id: Date.now(),
          title: "Code Detected",
          message: "Pasted content was formatted as code.",
          type: "info",
        })
      );

      return false;
    }

    // For non-code content, let the default paste behavior happen
    return true;
  };

  // Format text
  const formatText = (format) => {
    switch (format) {
      case "bold":
        execCommand("bold");
        break;
      case "italic":
        execCommand("italic");
        break;
      case "underline":
        execCommand("underline");
        break;
      case "alignLeft":
        execCommand("justifyLeft");
        break;
      case "alignCenter":
        execCommand("justifyCenter");
        break;
      case "alignRight":
        execCommand("justifyRight");
        break;
      case "bulletList":
        execCommand("insertUnorderedList");
        break;
      case "orderedList":
        execCommand("insertOrderedList");
        break;
      case "h1":
        execCommand("formatBlock", "<h1>");
        break;
      case "h2":
        execCommand("formatBlock", "<h2>");
        break;
      case "h3":
        execCommand("formatBlock", "<h3>");
        break;
      case "paragraph":
        execCommand("formatBlock", "<p>");
        break;
      case "quote":
        execCommand("formatBlock", "<blockquote>");
        break;
      case "code":
        formatCodeBlock();
        break;
      case "table":
        // Create a dialog for table creation
        const tableDialog = document.createElement("div");
        tableDialog.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 20px; border-radius: 8px; width: 300px; color: black;">
              <h3 style="margin-top: 0;">Insert Table</h3>
              <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">Rows:</label>
                <input type="number" id="table-rows" min="1" max="20" value="3" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Columns:</label>
                <input type="number" id="table-cols" min="1" max="10" value="3" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="table-cancel" style="padding: 8px 16px; background: #f1f1f1; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="table-insert" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">Insert</button>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(tableDialog);

        // Handle dialog actions
        document
          .getElementById("table-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(tableDialog);
          });

        document
          .getElementById("table-insert")
          .addEventListener("click", () => {
            const rows =
              Number.parseInt(document.getElementById("table-rows").value) || 3;
            const cols =
              Number.parseInt(document.getElementById("table-cols").value) || 3;

            let tableHTML =
              '<table style="width:100%; border-collapse: collapse; margin: 15px 0;">';

            // Add header row
            tableHTML += "<thead><tr>";
            for (let j = 0; j < cols; j++) {
              tableHTML +=
                '<th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Header ' +
                (j + 1) +
                "</th>";
            }
            tableHTML += "</tr></thead><tbody>";

            // Add data rows
            for (let i = 0; i < rows - 1; i++) {
              tableHTML += "<tr>";
              for (let j = 0; j < cols; j++) {
                tableHTML +=
                  '<td style="border: 1px solid #ccc; padding: 8px;">Cell ' +
                  (i + 1) +
                  "-" +
                  (j + 1) +
                  "</td>";
              }
              tableHTML += "</tr>";
            }

            tableHTML += "</tbody></table>";

            execCommand("insertHTML", tableHTML);
            document.body.removeChild(tableDialog);

            dispatch(
              addNotification({
                id: Date.now(),
                title: "Table Inserted",
                message: `Added a ${rows}×${cols} table to your document.`,
                type: "success",
              })
            );
          });
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) execCommand("createLink", url);
        break;
      case "image":
        const imgUrl = prompt("Enter image URL:");
        if (imgUrl) execCommand("insertImage", imgUrl);
        break;
      case "foreColor":
        execCommand("foreColor", currentColor);
        break;
      case "hiliteColor":
        execCommand("hiliteColor", currentHighlightColor);
        break;
      default:
        break;
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setUndoStack([...undoStack]);

      // Save current state to redo stack
      setRedoStack((prev) => [...prev, editorRef.current.innerHTML]);

      // Restore state
      editorRef.current.innerHTML = lastState;

      // Update document in Redux
      if (currentDocument) {
        dispatch(
          updateDocument({
            id: currentDocument.id,
            content: lastState,
          })
        );
      }

      updateCounts();
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setRedoStack([...redoStack]);

      // Save current state to undo stack
      setUndoStack((prev) => [...prev, editorRef.current.innerHTML]);

      // Restore state
      editorRef.current.innerHTML = nextState;

      // Update document in Redux
      if (currentDocument) {
        dispatch(
          updateDocument({
            id: currentDocument.id,
            content: nextState,
          })
        );
      }

      updateCounts();
    }
  };

  // AI features
  const handleAIAction = (action) => {
    if (!editorRef.current) return;

    // Get selected text or all text
    const selection = window.getSelection();
    let text = "";

    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      text = selection.toString();
    } else {
      text = editorRef.current.innerText;
    }

    if (!text.trim()) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: "Error",
          message: "Please select text or add content to the document first.",
          type: "error",
        })
      );
      return;
    }

    let result = "";
    switch (action) {
      case "summarize":
        result = `<div class="ai-result"><strong>Summary:</strong> This is a summarized version of your text. In a real implementation, this would use an AI model to generate a concise summary of the selected content.</div>`;
        break;
      case "explain":
        result = `<div class="ai-result"><strong>Explanation:</strong> Here's an explanation of the concepts in your text. This would provide simplified explanations of complex topics in the selected text.</div>`;
        break;
      case "translate":
        result = `<div class="ai-result"><strong>Translation:</strong> Here's your text translated to another language. In a real implementation, you would be able to select the target language.</div>`;
        break;
      case "grammar":
        result = `<div class="ai-result"><strong>Grammar Check:</strong> Grammar check complete. No issues found. In a real implementation, this would highlight grammar and spelling errors.</div>`;
        break;
      case "format":
        result = `<div class="ai-result"><strong>Formatting:</strong> Document formatting has been improved. This would restructure the document for better readability.</div>`;
        break;
      case "code":
        result = `<div class="ai-result"><strong>Code Formatting:</strong> Code snippets have been formatted. This would apply proper syntax highlighting and indentation to code blocks.</div>`;
        break;
      default:
        result = `<div class="ai-result"><strong>AI Processing:</strong> AI processing complete.</div>`;
    }

    // Insert result at cursor position or replace selection
    if (selection.rangeCount > 0) {
      if (!selection.isCollapsed) {
        // Replace selection
        selection.deleteFromDocument();
      }

      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = result;

      // Insert each child of the temp div
      while (tempDiv.firstChild) {
        range.insertNode(tempDiv.firstChild);
      }
    } else {
      // Append to end
      editorRef.current.innerHTML += result;
    }

    handleEditorInput();

    dispatch(
      addNotification({
        id: Date.now(),
        title: "AI Assistant",
        message: `${
          action.charAt(0).toUpperCase() + action.slice(1)
        } completed successfully.`,
        type: "info",
      })
    );
  };

  // Add collaborator
  const handleAddCollaborator = () => {
    if (!newCollaborator.email.trim()) return;

    setCollaborators([
      ...collaborators,
      {
        id: Date.now(),
        name: newCollaborator.email.split("@")[0],
        email: newCollaborator.email,
        role: newCollaborator.role,
      },
    ]);

    setNewCollaborator({ email: "", role: "viewer" });

    dispatch(
      addNotification({
        id: Date.now(),
        title: "Collaborator Added",
        message: `${newCollaborator.email} has been added as a ${newCollaborator.role}.`,
        type: "success",
      })
    );
  };

  // Remove collaborator
  const handleRemoveCollaborator = (id) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {showFolders && (
        <div className="md:col-span-1">
          <DocumentFolders />
        </div>
      )}

      <Card
        className={`border shadow-sm ${
          showFolders ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFolders(!showFolders)}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
              <Input
                value={title}
                onChange={handleTitleChange}
                className="font-medium text-lg"
                placeholder="Document Title"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleNewDocument}>
                New
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="txt">Text</SelectItem>
                  <SelectItem value="md">Markdown</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <div className="flex flex-wrap items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={editorState.format.bold ? "default" : "ghost"}
                      size="icon"
                      onClick={() => formatText("bold")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={editorState.format.italic ? "default" : "ghost"}
                      size="icon"
                      onClick={() => formatText("italic")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.underline ? "default" : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("underline")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover
                      open={colorPickerOpen}
                      onOpenChange={setColorPickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Palette
                            className="h-4 w-4"
                            style={{ color: currentColor }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">Text Color</div>
                          <div className="grid grid-cols-8 gap-1">
                            {[
                              "#000000",
                              "#ff0000",
                              "#ff8000",
                              "#ffff00",
                              "#00ff00",
                              "#00ffff",
                              "#0000ff",
                              "#8000ff",
                              "#ffffff",
                              "#888888",
                              "#ff4444",
                              "#ffcc44",
                              "#ffff44",
                              "#44ff44",
                              "#44ffff",
                              "#4444ff",
                            ].map((color) => (
                              <div
                                key={color}
                                className="w-6 h-6 rounded-md cursor-pointer border"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setCurrentColor(color);
                                  formatText("foreColor");
                                  setColorPickerOpen(false);
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={currentColor}
                              onChange={(e) => setCurrentColor(e.target.value)}
                              className="w-8 h-8 p-0 border-0"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                formatText("foreColor");
                                setColorPickerOpen(false);
                              }}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>Text Color</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Highlighter
                            className="h-4 w-4"
                            style={{ color: currentHighlightColor }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">
                            Highlight Color
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {[
                              "#ffff00",
                              "#ff9900",
                              "#ff0000",
                              "#00ff00",
                              "#00ffff",
                              "#0000ff",
                              "#9900ff",
                              "#ff00ff",
                              "#ffffcc",
                              "#ffcc99",
                              "#ffcccc",
                              "#ccffcc",
                              "#ccffff",
                              "#ccccff",
                              "#ffccff",
                              "#eeeeee",
                            ].map((color) => (
                              <div
                                key={color}
                                className="w-6 h-6 rounded-md cursor-pointer border"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setCurrentHighlightColor(color);
                                  formatText("hiliteColor");
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={currentHighlightColor}
                              onChange={(e) =>
                                setCurrentHighlightColor(e.target.value)
                              }
                              className="w-8 h-8 p-0 border-0"
                            />
                            <Button
                              size="sm"
                              onClick={() => formatText("hiliteColor")}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>Highlight</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.align === "left"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("alignLeft")}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Left</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.align === "center"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("alignCenter")}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Center</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.align === "right"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("alignRight")}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Right</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.list === "bullet"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("bulletList")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        editorState.format.list === "ordered"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      onClick={() => formatText("orderedList")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => formatText("link")}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Link</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => formatText("image")}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => formatText("table")}
                    >
                      <Table className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Table</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleUndo}
                      disabled={undoStack.length === 0}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => formatText("code")}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Code Block</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={
                  editorState.format.heading === "h1"
                    ? "h1"
                    : editorState.format.heading === "h2"
                    ? "h2"
                    : editorState.format.heading === "h3"
                    ? "h3"
                    : "paragraph"
                }
                onValueChange={(value) => formatText(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                  <SelectItem value="code">Code Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            ref={editorRef}
            className="min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary prose dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-auto [&_code]:font-mono [&_code]:text-sm [&_table_th]:bg-muted [&_table_td]:border [&_table_th]:border [&_table_td]:p-2 [&_table_th]:p-2 [&_table]:border-collapse"
            contentEditable={true}
            onInput={handleEditorInput}
            onSelect={handleSelectionChange}
            onBlur={handleSelectionChange}
            onPaste={handlePaste}
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          ></div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("summarize")}
            >
              <Sparkles className="h-4 w-4" />
              Summarize
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("explain")}
            >
              <FileText className="h-4 w-4" />
              Explain
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("translate")}
            >
              <Languages className="h-4 w-4" />
              Translate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("grammar")}
            >
              <CheckSquare className="h-4 w-4" />
              Grammar Check
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("format")}
            >
              <FileQuestion className="h-4 w-4" />
              Format Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAIAction("code")}
            >
              <Braces className="h-4 w-4" />
              Format Code
            </Button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <div>
                Word count: {wordCount} | Character count: {charCount}
              </div>
              <div>Last saved: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="font-medium">Collaborators</div>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{collaborator.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {collaborator.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={collaborator.role}
                        onValueChange={(value) => {
                          setCollaborators(
                            collaborators.map((c) =>
                              c.id === collaborator.id
                                ? { ...c, role: value }
                                : c
                            )
                          );
                        }}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="font-medium">Add Collaborator</div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Email address"
                    value={newCollaborator.email}
                    onChange={(e) =>
                      setNewCollaborator({
                        ...newCollaborator,
                        email: e.target.value,
                      })
                    }
                  />
                  <Select
                    value={newCollaborator.role}
                    onValueChange={(value) =>
                      setNewCollaborator({ ...newCollaborator, role: value })
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddCollaborator}>Add</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Share Link</div>
                <div className="flex items-center gap-2">
                  <Input
                    value={`https://studyspace.app/documents/${
                      currentDocument?.id || "share"
                    }`}
                    readOnly
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://studyspace.app/documents/${
                          currentDocument?.id || "share"
                        }`
                      );
                      dispatch(
                        addNotification({
                          id: Date.now(),
                          title: "Link Copied",
                          message: "Share link has been copied to clipboard.",
                          type: "success",
                        })
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default DocumentEditor;
