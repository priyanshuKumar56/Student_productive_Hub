"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  File,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  createFolder,
  createDocumentInFolder,
  renameFolder,
  deleteFolder,
} from "@/redux/features/documentsSlice";

export function DocumentFolders() {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.documents);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");

  const toggleFolder = (folderId) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId],
    });
  };

  const handleCreateFolder = () => {
    if (showNewFolderInput) {
      if (newFolderInput.trim()) {
        dispatch(createFolder({ name: newFolderInput }));
        setNewFolderInput("");
      }
      setShowNewFolderInput(false);
    } else {
      setShowNewFolderInput(true);
    }
  };

  const handleCreateDocument = (folderId) => {
    dispatch(createDocumentInFolder({ folderId }));
  };

  const startEditingFolder = (folder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
  };

  const handleRenameFolder = () => {
    if (newFolderName.trim()) {
      dispatch(renameFolder({ id: editingFolder, name: newFolderName }));
    }
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId) => {
    dispatch(deleteFolder({ id: folderId }));
  };

  return (
    <div className="p-4 border rounded-md h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Folders</h3>
        <Button variant="ghost" size="icon" onClick={handleCreateFolder}>
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

      {showNewFolderInput && (
        <div className="flex items-center mb-2">
          <Input
            value={newFolderInput}
            onChange={(e) => setNewFolderInput(e.target.value)}
            placeholder="Folder name"
            className="text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") setShowNewFolderInput(false);
            }}
          />
        </div>
      )}

      <div className="space-y-1">
        {folders.map((folder) => (
          <div key={folder.id} className="space-y-1">
            <div className="flex items-center justify-between group">
              <div
                className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md cursor-pointer flex-grow"
                onClick={() => toggleFolder(folder.id)}
              >
                {expandedFolders[folder.id] ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}

                {editingFolder === folder.id ? (
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="h-6 text-sm py-0"
                    autoFocus
                    onBlur={handleRenameFolder}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameFolder();
                      if (e.key === "Escape") setEditingFolder(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm">{folder.name}</span>
                )}
              </div>

              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => startEditingFolder(folder)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCreateDocument(folder.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {expandedFolders[folder.id] && folder.documents && (
              <div className="pl-6 space-y-1">
                {folder.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md cursor-pointer"
                  >
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
