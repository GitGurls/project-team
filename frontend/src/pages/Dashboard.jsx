

import { useState, useEffect } from "react";
import API from "../api/axios";
import socket from "../socket/socket";

import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

import { toast } from "react-toastify";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const COLUMNS = [
  { id: "todo",        label: "To Do",       accent: "#6366f1", lightBg: "#eef2ff", icon: "○" },
  { id: "in-progress", label: "In Progress", accent: "#f59e0b", lightBg: "#fffbeb", icon: "◑" },
  { id: "done",        label: "Done",        accent: "#22c55e", lightBg: "#f0fdf4", icon: "●" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      if (res.data) setTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    }
  };

  // CREATE TASK
  const createTask = async (taskData) => {
    try {
      const res = await API.post("/tasks", taskData);
      toast.success("Task created successfully");
      setShowModal(false);
    } catch (err) {
      console.log("Create error:", err.response?.data || err.message);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const res = await API.delete(`/tasks/${id}`);
      console.log("Delete response:", res.data);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.error("Task deleted");
    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
      console.log("Status updated:", res.data);
      toast.info("Status updated");
    } catch (err) {
      console.log("Status update error:", err.response?.data || err.message);
    }
  };

  // UPDATE TASK (EDIT MODAL)
  const updateTask = async (id, taskData) => {
    try {
      const res = await API.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((t) => t._id === id ? res.data : t));
      toast.success("Task updated");
      setEditingTask(null);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // SOCKET EVENTS
  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });
    socket.on("taskDeleted", (id) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });
    socket.on("taskUpdated", (task) => {
      setTasks((prev) => prev.map((t) => t._id === task._id ? task : t));
    });
    socket.on("taskStatusUpdated", (task) => {
      setTasks((prev) => prev.map((t) => t._id === task._id ? task : t));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
      socket.off("taskStatusUpdated");
    };
  }, []);

  // DRAG DROP
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    updateStatus(active.id, over.id);
  };

  // FILTER TASKS
  const getTasks = (status) =>
    tasks.filter(
      (task) =>
        task.status === status &&
        (task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()))
    );

  const totalDone = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f5f6fa; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .tf-search:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); outline: none; }
        .tf-new-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.38) !important; }
        .tf-logout:hover { background: #fef2f2 !important; }
        .tf-add:hover { color: #6366f1 !important; border-color: #6366f1 !important; background: #f5f3ff !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── NAVBAR ── */}
        <div style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 28px",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>⚡</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#111827" }}>
              TaskFlow
            </span>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              fontSize: 13, color: "#9ca3af", pointerEvents: "none",
            }}>🔍</span>
            <input
              className="tf-search"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 14px 8px 32px", borderRadius: 10,
                border: "1px solid #e5e7eb", fontSize: 13,
                background: "#f9fafb", outline: "none", width: 230,
                fontFamily: "'DM Sans', sans-serif", color: "#111827",
                transition: "all 0.2s",
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="tf-new-btn"
              onClick={() => setShowModal(true)}
              style={{
                padding: "9px 18px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 5,
                boxShadow: "0 3px 12px rgba(99,102,241,0.28)",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New Task
            </button>

            <button
              className="tf-logout"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              style={{
                padding: "9px 16px", borderRadius: 10,
                border: "1px solid #fecaca", background: "#fff",
                color: "#ef4444", fontWeight: 600, fontSize: 13,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── PAGE BODY ── */}
        <div style={{ padding: "26px 28px" }}>

          {/* Page header + sprint progress */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: 22,
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontSize: 23,
                fontWeight: 800, color: "#111827", marginBottom: 3,
              }}>Project Board</h1>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                Track and manage your team's work in real-time
              </p>
            </div>

            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "10px 18px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div>
                <p style={{
                  fontSize: 10, color: "#9ca3af", fontWeight: 700,
                  marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6,
                }}>Sprint Progress</p>
                <div style={{ width: 130, background: "#e5e7eb", borderRadius: 10, height: 6 }}>
                  <div style={{
                    width: `${progress}%`, height: "100%", borderRadius: 10,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontSize: 22,
                fontWeight: 800, color: "#6366f1",
              }}>{progress}%</span>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14, marginBottom: 24,
          }}>
            {[
              { label: "Total Tasks",  value: tasks.length,                                          color: "#6366f1", bg: "#eef2ff" },
              { label: "To Do",        value: tasks.filter((t) => t.status === "todo").length,        color: "#6366f1", bg: "#eef2ff" },
              { label: "In Progress",  value: tasks.filter((t) => t.status === "in-progress").length, color: "#f59e0b", bg: "#fffbeb" },
              { label: "Completed",    value: totalDone,                                              color: "#22c55e", bg: "#f0fdf4" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: "16px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 6 }}>
                  {stat.label}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 28,
                    fontWeight: 800, color: "#111827",
                  }}>{stat.value}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: stat.color,
                    background: stat.bg, padding: "2px 8px", borderRadius: 20,
                  }}>tasks</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── KANBAN BOARD ── */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>

              {COLUMNS.map((col) => {
                const colTasks = getTasks(col.id);
                return (
                  <div key={col.id} style={{
                    background: "#fff", borderRadius: 16,
                    border: "1px solid #e5e7eb", overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    {/* Column header */}
                    <div style={{
                      padding: "15px 18px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, color: col.accent }}>{col.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {col.label}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: col.accent,
                        background: col.lightBg, width: 24, height: 24,
                        borderRadius: "50%", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>{colTasks.length}</span>
                    </div>

                    {/* Task list */}
                    <div style={{
                      padding: "12px 12px 6px",
                      minHeight: 140,
                      maxHeight: "calc(100vh - 400px)",
                      overflowY: "auto",
                    }}>
                      {colTasks.length === 0 && (
                        <div style={{
                          textAlign: "center", padding: "28px 0",
                          color: "#d1d5db", fontSize: 13, fontStyle: "italic",
                        }}>No tasks here</div>
                      )}

                      <SortableContext
                        items={colTasks.map((t) => t._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {colTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            deleteTask={deleteTask}
                            updateStatus={updateStatus}
                            editTask={setEditingTask}
                          />
                        ))}
                      </SortableContext>
                    </div>

                    {/* Add task shortcut */}
                    <div style={{ padding: "6px 12px 12px" }}>
                      <button
                        className="tf-add"
                        onClick={() => setShowModal(true)}
                        style={{
                          width: "100%", padding: "8px", borderRadius: 8,
                          border: "1px dashed #d1d5db", background: "transparent",
                          color: "#9ca3af", fontSize: 13, cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                        }}
                      >+ Add task</button>
                    </div>
                  </div>
                );
              })}

            </div>
          </DndContext>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <TaskModal
          createTask={createTask}
          closeModal={() => setShowModal(false)}
        />
      )}

      {/* EDIT MODAL */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          updateTask={updateTask}
          closeModal={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
