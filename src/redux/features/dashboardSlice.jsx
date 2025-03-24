import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [
    { id: "doc1", title: "Study Notes", lastEdited: "2 hours ago" },
    { id: "doc2", title: "Project Plan", lastEdited: "Yesterday" },
    { id: "doc3", title: "Research Paper", lastEdited: "3 days ago" },
  ],
  whiteboards: [
    { id: "wb1", title: "Project Brainstorm", lastEdited: "1 hour ago" },
    { id: "wb2", title: "System Architecture", lastEdited: "Yesterday" },
    { id: "wb3", title: "UI Wireframes", lastEdited: "2 days ago" },
  ],
  recentItems: [
    {
      id: "doc1",
      title: "Study Notes",
      type: "document",
      lastEdited: "2 hours ago",
    },
    {
      id: "wb1",
      title: "Project Brainstorm",
      type: "whiteboard",
      lastEdited: "1 hour ago",
    },
    {
      id: "doc2",
      title: "Project Plan",
      type: "document",
      lastEdited: "Yesterday",
    },
    {
      id: "wb2",
      title: "System Architecture",
      type: "whiteboard",
      lastEdited: "Yesterday",
    },
    {
      id: "doc3",
      title: "Research Paper",
      type: "document",
      lastEdited: "3 days ago",
    },
    {
      id: "wb3",
      title: "UI Wireframes",
      type: "whiteboard",
      lastEdited: "2 days ago",
    },
  ],
  stats: {
    newDocumentsThisWeek: 5,
    newWhiteboardsThisWeek: 3,
    studyHours: 12,
    studyHoursIncrease: 20,
    goalCompletion: 65,
  },
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Add this new action to update recent items when a document or whiteboard is edited
    updateRecentItem: (state, action) => {
      const { id, type, title } = action.payload;

      // Find the item in recent items
      const existingItemIndex = state.recentItems.findIndex(
        (item) => item.id === id && item.type === type
      );

      // If item exists, update it and move to top
      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...state.recentItems[existingItemIndex],
          title: title || state.recentItems[existingItemIndex].title,
          lastEdited: "Just now",
        };

        // Remove the existing item
        state.recentItems.splice(existingItemIndex, 1);

        // Add the updated item to the top
        state.recentItems.unshift(updatedItem);
      } else {
        // If item doesn't exist in recent items, add it
        state.recentItems.unshift({
          id,
          title:
            title ||
            (type === "document" ? "Untitled Document" : "Untitled Whiteboard"),
          type,
          lastEdited: "Just now",
        });
      }

      // Limit recent items to 10
      if (state.recentItems.length > 10) {
        state.recentItems = state.recentItems.slice(0, 10);
      }

      // Update stats
      if (type === "document") {
        // Check if this is a new document this week
        const existingDocIndex = state.documents.findIndex(
          (doc) => doc.id === id
        );
        if (existingDocIndex === -1) {
          state.stats.newDocumentsThisWeek += 1;
        }
      } else if (type === "whiteboard") {
        // Check if this is a new whiteboard this week
        const existingWbIndex = state.whiteboards.findIndex(
          (wb) => wb.id === id
        );
        if (existingWbIndex === -1) {
          state.stats.newWhiteboardsThisWeek += 1;
        }
      }
    },

    // Modify createNewDocument to update recent items
    createNewDocument: (state) => {
      const newDoc = {
        id: Date.now().toString(),
        title: "Untitled Document",
        lastEdited: "Just now",
      };
      state.documents.unshift(newDoc);

      // Add to recent items
      state.recentItems.unshift({
        ...newDoc,
        type: "document",
      });

      // Limit recent items to 10
      if (state.recentItems.length > 10) {
        state.recentItems = state.recentItems.slice(0, 10);
      }

      state.stats.newDocumentsThisWeek += 1;
    },

    // Modify createNewWhiteboard to update recent items
    createNewWhiteboard: (state) => {
      const newWhiteboard = {
        id: Date.now().toString(),
        title: "Untitled Whiteboard",
        lastEdited: "Just now",
      };
      state.whiteboards.unshift(newWhiteboard);

      // Add to recent items
      state.recentItems.unshift({
        ...newWhiteboard,
        type: "whiteboard",
      });

      // Limit recent items to 10
      if (state.recentItems.length > 10) {
        state.recentItems = state.recentItems.slice(0, 10);
      }

      state.stats.newWhiteboardsThisWeek += 1;
    },

    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(
        (doc) => doc.id !== action.payload
      );
      state.recentItems = state.recentItems.filter(
        (item) => !(item.id === action.payload && item.type === "document")
      );
    },

    deleteWhiteboard: (state, action) => {
      state.whiteboards = state.whiteboards.filter(
        (wb) => wb.id !== action.payload
      );
      state.recentItems = state.recentItems.filter(
        (item) => !(item.id === action.payload && item.type === "whiteboard")
      );
    },

    updateStudyTime: (state, action) => {
      const { minutes } = action.payload;
      state.stats.studyHours += minutes / 60;

      // Update goal completion based on study time
      const weeklyGoalHours = 20; // Example: 20 hours per week goal
      state.stats.goalCompletion = Math.min(
        100,
        Math.round((state.stats.studyHours / weeklyGoalHours) * 100)
      );
    },

    // Add this to sync document and whiteboard counts
    syncCounts: (state) => {
      state.stats.totalDocuments = state.documents.length;
      state.stats.totalWhiteboards = state.whiteboards.length;
    },
  },
});

export const {
  createNewDocument,
  createNewWhiteboard,
  deleteDocument,
  deleteWhiteboard,
  updateStudyTime,
  updateRecentItem,
  syncCounts,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
