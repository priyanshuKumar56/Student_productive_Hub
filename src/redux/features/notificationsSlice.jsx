import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notifications: [
    {
      id: 1,
      title: "Welcome to StudySpace",
      message: "Get started by creating a new document or whiteboard.",
      type: "info",
      read: false,
      time: "5 min ago",
    },
    {
      id: 2,
      title: "Tip: Use AI Features",
      message: "Try the AI-powered features to enhance your productivity.",
      type: "tip",
      read: false,
      time: "10 min ago",
    },
  ],
  unreadCount: 2,
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        ...action.payload,
        read: false,
        time: action.payload.time || "Just now",
      })
      state.unreadCount += 1
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload)
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount -= 1
        }
        state.notifications.splice(index, 1)
      }
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer

