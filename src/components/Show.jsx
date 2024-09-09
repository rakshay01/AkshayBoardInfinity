import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { useDrag, useDrop } from "react-dnd";
import { updateTask } from "../store/tasksSlice";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import TodayIcon from '@mui/icons-material/Today';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks || []); // Default to empty array if tasks is undefined
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const statuses = [
    {
      title: "TODO",
      status: "todo",
      textColor: "text-white",
      headerColor: "bg-[#8a30e5]",
    },
    {
      title: "IN PROGRESS",
      status: "inprogress",
      textColor: "text-black",
      headerColor: "bg-yellow-500",
    },
    {
      title: "COMPLETED",
      status: "completed",
      textColor: "text-white",
      headerColor: "bg-green-500",
    },
  ];
  const Close = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedTask(null);
  };

  return (
    <div className="w-screen flex flex-col items-center justify-between gap-20">
      <div className="flex flex-col sm:flex-row w-3/4 justify-evenly">
        {statuses.map(({ status, textColor, headerColor, title }, index) => (
          <Section
            key={index}
            status={status}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            textColor={textColor}
            title={title}
            headerColor={headerColor}
          />
        ))}
      </div>
      <Modal
        onClose={(e) => Close(e)}
        isOpen={!!selectedTask}
        task={selectedTask}
        setTask={setSelectedTask}
      />
    </div>
  );
};

const Section = ({
  status,
  tasks,
  onTaskClick,
  textColor,
  title,
  headerColor,
}) => {
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      dispatch(updateTask({ id: item.id, status }));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      ref={drop}
      className={`w-full rounded-xl p-2 ${isOver ? "bg-opacity-75" : ""}`}
    >
      <div className="bg-white min-h-60 pb-0.5 rounded-b-xl">
        <Header
          text={status}
          count={filteredTasks.length}
          textColor={textColor}
          headerColor={headerColor}
          title={title}
        />
        {filteredTasks.length > 0 &&
          filteredTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
            />
          ))}
      </div>
    </div>
  );
};

const Header = ({ textColor, headerColor, title }) => {
  return (
    <div
      className={`${headerColor} flex-col justify-center md:flex items-center h-12 pl-4 rounded-t-xl uppercase text-sm`}
    >
      <div
        className={`rounded-xl pl-2 pr-2 text-xl font-semibold ${textColor}`}
      >
        {title}
      </div>
    </div>
  );
};

const Task = ({ task, onTaskClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  // Handle status change
  const handleStatusChange = (newStatus) => {
    dispatch(updateTask({ ...task, status: newStatus }));
    setDropdownOpen(false); // Close the dropdown after selection
  };

  // Stop modal from opening on arrow icon click
  const handleIconClick = (e) => {
    e.stopPropagation(); // Prevent the modal from opening
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <div>
      <div
        ref={drag}
        className={`relative p-3 m-4 shadow-md rounded-xl h-auto hover:bg-gray-200 min-h border border-solid border-gray-300 ${
          isDragging ? "opacity-10" : "opacity-100"
        } cursor-grab`}
        onClick={() => onTaskClick(task)} 
      >
        <div className="bg-rose-300 text-rose-600 w-fit px-3 py-1 rounded-md">
          {task.priority}
        </div>
        <div className="p-2 text-xl flex justify-between items-center">
          <div className="font-semibold">{task.name}</div>
          <div className="relative">
            <KeyboardArrowDownOutlinedIcon
              onClick={handleIconClick}
              className="cursor-pointer"
            />

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-xl border font-semibold border-gray-300 z-10"
                onClick={(e) => e.stopPropagation()}
                
              >
                <ul className="py-0">
                  <li
                    className="px-4 py-2 bg-blue-100 rounded-t-xl"
                    onClick={() => handleStatusChange("todo")}
                  >
                    Change Status
                  </li>

                  <li
                    className="px-4 py-2  hover:bg-gray-200 font-normal cursor-pointer border-t border-gray-300"
                    onClick={() => handleStatusChange("todo")}
                  >
                    Todo
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-gray-200 font-normal cursor-pointer border-t border-gray-300"
                    onClick={() => handleStatusChange("inprogress")}
                  >
                    In Progress
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-gray-200 font-normal cursor-pointer border-t border-gray-300"
                    onClick={() => handleStatusChange("completed")}
                  >
                    Completed
                  </li>
                </ul>
              </div>
            )}
          </div>
          
        </div>
        <div className="text-gray-600 font-normal p-2 overflow-auto max-h-24">
        {task.description}
      </div>
          
        <p className="p-2 border-t border-gray-300 text-gray-500 mt-1"><TodayIcon/>: {task.date}</p>
      </div>
    </div>
  );
};

export default TaskList;
