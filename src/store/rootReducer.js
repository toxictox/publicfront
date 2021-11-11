import { combineReducers } from "@reduxjs/toolkit";
import { reducer as calendarReducer } from "../slices/calendar";
import { reducer as chatReducer } from "../slices/chat";
import { reducer as kanbanReducer } from "../slices/kanban";
import { reducer as mailReducer } from "../slices/mail";
import { reducer as dialogReducer } from "../slices/dialog";
import { reducer as filterReducer } from "../slices/filter";

const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  dialog: dialogReducer,
  filter: filterReducer,
});

export default rootReducer;
