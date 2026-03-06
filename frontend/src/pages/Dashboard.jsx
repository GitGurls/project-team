
import { useState, useEffect } from "react";
import API from "../api/axios";
import socket from "../socket/socket";

import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

export default function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // CREATE TASK
  const createTask = async (title, description) => {
    try {
      await API.post("/tasks", { title, description });
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  // const deleteTask = async (id) => {
  //   try {
  //     await API.delete(`/tasks/${id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

 const deleteTask = async (id) => {
  try {
    await API.delete(`/tasks/${id}`);

    setTasks((prev) => prev.filter((t) => t._id !== id));

  } catch (err) {
    console.log(err);
  }
};

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}/status`, { status });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    fetchTasks();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("taskDeleted", (id) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

    socket.on("taskUpdated", (task) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });

    socket.on("taskStatusUpdated", (task) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
      socket.off("taskStatusUpdated");
    };

  }, []);

  // DRAG END
  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    updateStatus(taskId, newStatus);
  };

  // FILTER TASKS
  const getTasks = (status) =>
    tasks.filter((task) => task.status === status);

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-8">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            TaskFlow Dashboard
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + New Task
          </button>

        </div>

        {/* DRAG CONTEXT */}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <div className="grid grid-cols-3 gap-6">

            {/* TODO */}

            <div
              id="todo"
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold mb-4">Todo</h2>

              <SortableContext
                items={getTasks("todo").map((t)=>t._id)}
                strategy={verticalListSortingStrategy}
              >

                {getTasks("todo").map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    deleteTask={deleteTask}
                    updateStatus={updateStatus}
                  />
                ))}

              </SortableContext>

            </div>

            {/* IN PROGRESS */}

            <div
              id="in-progress"
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold mb-4">
                In Progress
              </h2>

              <SortableContext
                items={getTasks("in-progress").map((t)=>t._id)}
                strategy={verticalListSortingStrategy}
              >

                {getTasks("in-progress").map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    deleteTask={deleteTask}
                    updateStatus={updateStatus}
                  />
                ))}

              </SortableContext>

            </div>

            {/* DONE */}

            <div
              id="done"
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold mb-4">Done</h2>

              <SortableContext
                items={getTasks("done").map((t)=>t._id)}
                strategy={verticalListSortingStrategy}
              >

                {getTasks("done").map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    deleteTask={deleteTask}
                    updateStatus={updateStatus}
                  />
                ))}

              </SortableContext>

            </div>

          </div>

        </DndContext>

      </div>

      {showModal && (
        <TaskModal
          createTask={createTask}
          closeModal={() => setShowModal(false)}
        />
      )}

    </div>
  );
}