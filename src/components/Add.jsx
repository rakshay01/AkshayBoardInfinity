import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTask } from "../store/tasksSlice";
import { AiOutlineClose } from "react-icons/ai";
import { PlusCircleFilled } from "@ant-design/icons";

const TaskInput = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [display, setDisplay] = useState(false);

  const [task, setTask] = useState({
    name: "",
    status: "todo",
    description: "",
    priority: "low",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.name.length < 3) {
      toast.error("Task name should be at least 3 characters long", {
        autoClose: 2000,
      });
      return;
    }
    const newTask = { ...task, id: uuidv4() };
    dispatch(addTask(newTask));
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    setTask({ name: "", status: "todo", description: "", priority: "low" });
    setDisplay(false);
    toast.success("Task added successfully", { autoClose: 2000 });
  };

  const handlePlusButton = () => {
    setDisplay(true);
  };

  const handlePopClose = (e) => {
    if (e.target === e.currentTarget) {
      setDisplay(false);
    }
  };

  return (
    <>
      {display ? (
        <div
          className="fixed top-0 left-0 z-40 w-full h-full flex items-center justify-center bg-gray-400 bg-opacity-80"
          onClick={handlePopClose}
        >
          <div className="bg-white rounded-md p-4 w-3/6 h-5/6  ">
            <div className="w-full h-full  ">
              <form
                className="flex flex-col w-full h-full  justify-between"
                onSubmit={handleSubmit}
              >
                <div className="w-full flex justify-between">
                  <div className="flex gap-5">
                    <div>
                      <PlusCircleFilled className="" />
                    </div>
                    <div className="font-semibold">Create New Task</div>
                  </div>

                  <div>
                    <AiOutlineClose
                      onClick={handlePopClose}
                      className="text-3xl rounded-md p-2 flex items-center justify-center hover: hover:bg-rose-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer "
                    />
                  </div>
                </div>
                <div className="flex flex-col my-2">
                  <label
                    className="text-sm font-semibold max-sm:text-xs text-black"
                    htmlFor="taskName"
                  >
                    Title
                  </label>

                  <input
                    className="h-10 w-full border-2 p-3 rounded-md mb-1 my-1 focus:outline-0 hover:bg-gray-200 "
                    type="text"
                    placeholder="Select here"
                    name="name"
                    required
                    value={task.name}
                    onChange={(e) => setTask({ ...task, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col my-2">
                  <label
                    className="text-sm font-semibold max-sm:text-xs text-black"
                    htmlFor="taskName"
                  >
                    Description
                  </label>
                  <textarea
                    className=" p-2 border-2 rounded-md mb-2 my-1 min-h-20 w-full resize-none focus:outline-0 hover:bg-gray-200"
                    placeholder="Task Description"
                    name="description"
                    value={task.description}
                    onChange={(e) =>
                      setTask({ ...task, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="flex flex-col my-2">
                  <div className="flex flex-row justify-between">
                    <label
                      className="text-sm font-semibold max-sm:text-xs text-black"
                      htmlFor="taskStatus"
                    >
                      Status
                    </label>
                  </div>
                  <select
                    className="bg-gray-100 p-2 rounded-md mb-2 my-1 focus:outline-0 hover:bg-gray-200"
                    name="status"
                    value={task.status}
                    onChange={(e) =>
                      setTask({ ...task, status: e.target.value })
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex flex-col my-2">
                  <div className="flex flex-row justify-between">
                    <label
                      className="text-sm font-semibold max-sm:text-xs text-black"
                      htmlFor="taskStatus"
                    >
                      Priority
                    </label>
                  </div>
                  <select
                    className="bg-gray-100 p-2 rounded-md mb-2 my-1 focus:outline-0 hover:bg-gray-200"
                    name="status"
                    value={task.priority}
                    onChange={(e) =>
                      setTask({ ...task, status: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-white text-purple-800 hover:border border-green-700 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-1/6 flex  items-center justify-around ">
          <div className="w-3/4 h-2/3 flex items-center justify-between bg-white p-4 rounded-xl ">
            <div className="font-semibold text-2xl">
              Desktop & Mobile Application
            </div>
            <div
              onClick={handlePlusButton}
              className="bg-[#8a31e5] hover:bg-purple-800 text-lg py-2 px-5 rounded-md text-white cursor-pointer"
            >
              Create Task
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskInput;
