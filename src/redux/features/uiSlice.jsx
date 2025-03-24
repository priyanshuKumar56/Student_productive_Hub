import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  activeTab: "dashboard",
  sidebarOpen: true,
  theme: "system",
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { setActiveTab, toggleSidebar, setTheme } = uiSlice.actions

export default uiSlice.reducer

