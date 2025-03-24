import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  whiteboards: [
    {
      id: "wb1",
      title: "Project Brainstorm",
      thumbnail: null,
      lastEdited: "1 hour ago",
    },
    {
      id: "wb2",
      title: "System Architecture",
      thumbnail: null,
      lastEdited: "Yesterday",
    },
    {
      id: "wb3",
      title: "UI Wireframes",
      thumbnail: null,
      lastEdited: "2 days ago",
    },
  ],
  currentWhiteboard: null,
};

export const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setCurrentWhiteboard: (state, action) => {
      state.currentWhiteboard = state.whiteboards.find(
        (wb) => wb.id === action.payload
      );
    },
    updateWhiteboard: (state, action) => {
      if (state.currentWhiteboard) {
        state.currentWhiteboard = {
          ...state.currentWhiteboard,
          ...action.payload,
        };

        const index = state.whiteboards.findIndex(
          (wb) => wb.id === state.currentWhiteboard.id
        );
        if (index !== -1) {
          state.whiteboards[index] = {
            ...state.whiteboards[index],
            ...action.payload,
            lastEdited: "Just now",
          };
        }
      }
    },
    saveWhiteboard: (state, action) => {
      const { id, title, thumbnail } = action.payload;
      const index = state.whiteboards.findIndex((wb) => wb.id === id);

      if (index !== -1) {
        // Update existing whiteboard
        state.whiteboards[index] = {
          ...state.whiteboards[index],
          title,
          thumbnail,
          lastEdited: "Just now",
        };
        state.currentWhiteboard = state.whiteboards[index];
      } else {
        // Create new whiteboard
        const newWhiteboard = {
          id: Date.now().toString(),
          title,
          thumbnail,
          lastEdited: "Just now",
        };
        state.whiteboards.unshift(newWhiteboard);
        state.currentWhiteboard = newWhiteboard;
      }
    },
    createNewWhiteboard: (state) => {
      const newWhiteboard = {
        id: Date.now().toString(),
        title: "Untitled Whiteboard",
        thumbnail: null,
        lastEdited: "Just now",
      };
      state.whiteboards.push(newWhiteboard);
      state.currentWhiteboard = newWhiteboard;
    },
    deleteWhiteboard: (state, action) => {
      const { id } = action.payload;
      state.whiteboards = state.whiteboards.filter((wb) => wb.id !== id);
      if (state.currentWhiteboard && state.currentWhiteboard.id === id) {
        state.currentWhiteboard = null;
      }
    },
  },
});

export const {
  setCurrentWhiteboard,
  updateWhiteboard,
  saveWhiteboard,
  createNewWhiteboard,
  deleteWhiteboard,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
