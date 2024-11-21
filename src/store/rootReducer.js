import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from '../slices/calendar';
import { reducer as chatReducer } from '../slices/chat';
import { reducer as dialogReducer } from '../slices/dialog';
import { reducer as filterReducer } from '../slices/filter';
import { reducer as kanbanReducer } from '../slices/kanban';
import { reducer as mailReducer } from '../slices/mail';
import { reducer as  authReducer} from '../slices/authBck';

const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  dialog: dialogReducer,
  filter: filterReducer,
  auth: authReducer
});

export default rootReducer;
