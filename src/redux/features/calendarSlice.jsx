import { createSlice } from "@reduxjs/toolkit";

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
};

// Generate some sample events
const generateSampleEvents = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: "1",
      title: "Study Session - Math",
      description: "Review calculus problems for upcoming exam",
      date: getCurrentDate(),
      startTime: "10:00",
      endTime: "12:00",
      type: "study",
      color: "#4f46e5",
      attachments: [{ type: "document", id: "doc1" }],
      reminder: 15,
      isAllDay: false,
      recurrence: null,
      location: "Library",
      calendar: "academic",
    },
    {
      id: "2",
      title: "Group Project Meeting",
      description: "Discuss progress on the final project",
      date: `${tomorrow.getFullYear()}-${String(
        tomorrow.getMonth() + 1
      ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`,
      startTime: "14:00",
      endTime: "15:30",
      type: "meeting",
      color: "#0ea5e9",
      attachments: [
        { type: "document", id: "doc2" },
        { type: "whiteboard", id: "wb1" },
      ],
      reminder: 30,
      isAllDay: false,
      recurrence: null,
      location: "Student Center Room 302",
      calendar: "academic",
    },
    {
      id: "3",
      title: "Physics Exam",
      description: "Final exam for Physics 101",
      date: `${nextWeek.getFullYear()}-${String(
        nextWeek.getMonth() + 1
      ).padStart(2, "0")}-${String(nextWeek.getDate()).padStart(2, "0")}`,
      startTime: "09:00",
      endTime: "11:00",
      type: "exam",
      color: "#ef4444",
      attachments: [],
      reminder: 1440, // 1 day before
      isAllDay: false,
      recurrence: null,
      location: "Science Building Room 101",
      calendar: "academic",
    },
    {
      id: "4",
      title: "Spring Break",
      description: "No classes",
      date: `${nextWeek.getFullYear()}-${String(
        nextWeek.getMonth() + 1
      ).padStart(2, "0")}-${String(nextWeek.getDate() + 3).padStart(2, "0")}`,
      startTime: "00:00",
      endTime: "23:59",
      type: "holiday",
      color: "#22c55e",
      attachments: [],
      reminder: 0,
      isAllDay: true,
      recurrence: null,
      location: "",
      calendar: "holidays",
    },
    {
      id: "5",
      title: "Weekly Study Group",
      description: "Regular study session with classmates",
      date: getCurrentDate(),
      startTime: "16:00",
      endTime: "18:00",
      type: "study",
      color: "#8b5cf6",
      attachments: [],
      reminder: 60,
      isAllDay: false,
      recurrence: "weekly",
      location: "Library Study Room 3",
      calendar: "academic",
    },
  ];
};

// Generate sample calendars
const generateSampleCalendars = () => {
  return [
    {
      id: "academic",
      name: "Academic",
      color: "#4f46e5",
      visible: true,
      isDefault: true,
    },
    {
      id: "personal",
      name: "Personal",
      color: "#8b5cf6",
      visible: true,
      isDefault: false,
    },
    {
      id: "holidays",
      name: "Holidays",
      color: "#22c55e",
      visible: true,
      isDefault: false,
    },
    {
      id: "deadlines",
      name: "Assignment Deadlines",
      color: "#ef4444",
      visible: true,
      isDefault: false,
    },
  ];
};

const initialState = {
  events: generateSampleEvents(),
  selectedDate: getCurrentDate(),
  view: "month",
  calendars: generateSampleCalendars(),
  selectedCalendars: ["academic", "personal", "holidays", "deadlines"],
  reminders: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    addCalendar: (state, action) => {
      state.calendars.push(action.payload);
      state.selectedCalendars.push(action.payload.id);
    },
    updateCalendar: (state, action) => {
      const index = state.calendars.findIndex(
        (calendar) => calendar.id === action.payload.id
      );
      if (index !== -1) {
        state.calendars[index] = action.payload;
      }
    },
    deleteCalendar: (state, action) => {
      state.calendars = state.calendars.filter(
        (calendar) => calendar.id !== action.payload
      );
      state.selectedCalendars = state.selectedCalendars.filter(
        (id) => id !== action.payload
      );
      // Remove events associated with this calendar
      state.events = state.events.filter(
        (event) => event.calendar !== action.payload
      );
    },
    toggleCalendarVisibility: (state, action) => {
      const calendarId = action.payload;
      if (state.selectedCalendars.includes(calendarId)) {
        state.selectedCalendars = state.selectedCalendars.filter(
          (id) => id !== calendarId
        );
      } else {
        state.selectedCalendars.push(calendarId);
      }
    },
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload;
    },
    setCurrentYear: (state, action) => {
      state.currentYear = action.payload;
    },
    addReminder: (state, action) => {
      state.reminders.push(action.payload);
    },
    deleteReminder: (state, action) => {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.id !== action.payload
      );
    },
  },
});

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedDate,
  setView,
  addCalendar,
  updateCalendar,
  deleteCalendar,
  toggleCalendarVisibility,
  setCurrentMonth,
  setCurrentYear,
  addReminder,
  deleteReminder,
} = calendarSlice.actions;

export default calendarSlice.reducer;
