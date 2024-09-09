import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setTasks } from "./store/tasksSlice";
import store from "./store/store";
import TaskInput from "./components/Add";
import TaskList from "./components/Show";
import Greeting from "./components/nav";

const App = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        dispatch(setTasks(JSON.parse(storedTasks)));
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
      }
    } else {
      console.warn("No tasks found in localStorage.");
    }
  }, [dispatch]);

  return (
    <>
      
      <DndProvider backend={HTML5Backend}>
        <ToastContainer />
        <div className="bg-gray-100 min-h-screen">
          <div>
            <Greeting />
          </div>

          <TaskInput />
          <div>
            <TaskList />
          </div>
        </div>
        
      </DndProvider>
    </>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootApp;
