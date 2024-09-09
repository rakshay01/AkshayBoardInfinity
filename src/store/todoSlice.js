// store/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialTodoState = {
  list: [],
};

const todoSlice = createSlice({
  name: 'todoList',
  initialState: initialTodoState,
  reducers: {
    initializeTodos: (state, action) => {       
      state.list = action.payload;
    },
    createTodo: (state, action) => {
      state.list.push(action.payload);
    },
    modifyTodo: (state, action) => {
      const idx = state.list.findIndex(item => item.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload };
      }
    },
    removeTodo: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  },
});

export const { initializeTodos, createTodo, modifyTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
