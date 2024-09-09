import { createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase'; // Ensure the path is correct
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Add this if you are using toast for error messages

// Initial state for tasks
const initialState = {
  tasks: [],
};

// Create slice for tasks
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

// Export actions for use in components
export const { setTasks, addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;

// Fetch tasks from Firestore
export const fetchTasks = () => async (dispatch) => {
  try {
    const snapshot = await getDocs(collection(db, 'tasks'));
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks");
  }
};

// Add a task to Firestore
export const addTaskToFirebase = (task) => async (dispatch) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    dispatch(addTask({ id: docRef.id, ...task }));
  } catch (error) {
    console.error("Error adding task:", error);
    toast.error("Failed to add task");
  }
};

// Update a task in Firestore
export const updateTaskInFirebase = (task) => async (dispatch) => {
  try {
    const taskDoc = doc(db, 'tasks', task.id);
    await updateDoc(taskDoc, task);
    dispatch(updateTask(task));
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  }
};

// Delete a task from Firestore
export const deleteTaskFromFirebase = (id) => async (dispatch) => {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
    dispatch(removeTask(id));
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
  }
};
