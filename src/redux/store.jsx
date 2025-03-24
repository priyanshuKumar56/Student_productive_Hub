import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import documentsReducer from "./features/documentsSlice";
import whiteboardReducer from "./features/whiteboardSlice";
import notificationsReducer from "./features/notificationsSlice";
import dashboardReducer from "./features/dashboardSlice";
import calendarReducer from "./features/calendarSlice";

// Create middleware to update recent items when documents or whiteboards are saved
const recentItemsMiddleware = (store) => (next) => (action) => {
  // Process the action first
  const result = next(action);

  // Then check if we need to update recent items
  if (action.type === "documents/saveDocument") {
    const { id, title } = action.payload;
    store.dispatch({
      type: "dashboard/updateRecentItem",
      payload: { id, type: "document", title },
    });
  } else if (action.type === "whiteboard/saveWhiteboard") {
    const { id, title } = action.payload;
    store.dispatch({
      type: "dashboard/updateRecentItem",
      payload: { id, type: "whiteboard", title },
    });
  }

  return result;
};

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    documents: documentsReducer,
    whiteboard: whiteboardReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recentItemsMiddleware),
});
