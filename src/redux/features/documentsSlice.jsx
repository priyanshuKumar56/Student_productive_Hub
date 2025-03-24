import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [
    {
      id: "doc1",
      title: "Study Notes",
      content: "# Study Notes\n\nThis is a sample document.",
      lastEdited: "2 hours ago",
    },
    {
      id: "doc2",
      title: "Project Plan",
      content:
        "# Project Plan\n\n## Objectives\n\n- Complete research\n- Create prototype\n- Test with users",
      lastEdited: "Yesterday",
    },
    {
      id: "doc3",
      title: "Research Paper",
      content: "# Research Paper\n\n## Introduction\n\nThis paper explores...",
      lastEdited: "3 days ago",
    },
  ],
  currentDocument: null,
  folders: [
    {
      id: "folder1",
      name: "School",
      documents: [
        { id: "doc1", title: "Study Notes", lastEdited: "2 hours ago" },
        { id: "doc3", title: "Research Paper", lastEdited: "3 days ago" },
      ],
    },
    {
      id: "folder2",
      name: "Projects",
      documents: [
        { id: "doc2", title: "Project Plan", lastEdited: "Yesterday" },
      ],
    },
  ],
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = state.documents.find(
        (doc) => doc.id === action.payload
      );
    },
    updateDocument: (state, action) => {
      if (state.currentDocument) {
        state.currentDocument = {
          ...state.currentDocument,
          ...action.payload,
        };

        const index = state.documents.findIndex(
          (doc) => doc.id === state.currentDocument.id
        );
        if (index !== -1) {
          state.documents[index] = {
            ...state.documents[index],
            ...action.payload,
            lastEdited: "Just now",
          };
        }
      }
    },
    saveDocument: (state, action) => {
      const { id, title, content } = action.payload;
      const index = state.documents.findIndex((doc) => doc.id === id);

      if (index !== -1) {
        // Update existing document
        state.documents[index] = {
          ...state.documents[index],
          title,
          content,
          lastEdited: "Just now",
        };

        // Update document in folders if it exists there
        state.folders.forEach((folder) => {
          const docIndex = folder.documents?.findIndex((doc) => doc.id === id);
          if (docIndex !== -1) {
            folder.documents[docIndex] = {
              ...folder.documents[docIndex],
              title,
              lastEdited: "Just now",
            };
          }
        });

        state.currentDocument = state.documents[index];
      } else {
        // Create new document
        const newDoc = {
          id: Date.now().toString(),
          title,
          content,
          lastEdited: "Just now",
        };
        state.documents.unshift(newDoc);
        state.currentDocument = newDoc;
      }
    },
    createNewDocument: (state) => {
      const newDoc = {
        id: Date.now().toString(),
        title: "Untitled Document",
        content: "",
        lastEdited: "Just now",
      };
      state.documents.push(newDoc);
      state.currentDocument = newDoc;
    },
    createFolder: (state, action) => {
      const newFolder = {
        id: Date.now().toString(),
        name: action.payload.name,
        documents: [],
      };
      state.folders.push(newFolder);
    },
    createDocumentInFolder: (state, action) => {
      const { folderId } = action.payload;
      const newDoc = {
        id: Date.now().toString(),
        title: "Untitled Document",
        content: "",
        lastEdited: "Just now",
      };

      state.documents.push(newDoc);

      const folderIndex = state.folders.findIndex(
        (folder) => folder.id === folderId
      );
      if (folderIndex !== -1) {
        state.folders[folderIndex].documents.push({
          id: newDoc.id,
          title: newDoc.title,
          lastEdited: newDoc.lastEdited,
        });
      }

      state.currentDocument = newDoc;
    },
    renameFolder: (state, action) => {
      const { id, name } = action.payload;
      const folderIndex = state.folders.findIndex((folder) => folder.id === id);

      if (folderIndex !== -1) {
        state.folders[folderIndex].name = name;
      }
    },
    deleteFolder: (state, action) => {
      const { id } = action.payload;
      state.folders = state.folders.filter((folder) => folder.id !== id);
    },
  },
});

export const {
  setCurrentDocument,
  updateDocument,
  saveDocument,
  createNewDocument,
  createFolder,
  createDocumentInFolder,
  renameFolder,
  deleteFolder,
} = documentsSlice.actions;

export default documentsSlice.reducer;
