

// import { useState, useEffect } from "react";

// export default function TaskModal({
//   createTask,
//   updateTask,
//   task,
//   closeModal
// }) {

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   // const [dueDate, setDueDate] = useState("");

//   // EDIT MODE
//   useEffect(() => {

//     if (task) {
//       setTitle(task.title);
//       setDescription(task.description);
//       setDueDate(task.dueDate ? task.dueDate.substring(0,10) : "");
//     }

//   }, [task]);

//   const handleSubmit = () => {

//     const taskData = {
//       title,
//       description,
//       dueDate
//     };

//     if (task) {

//       updateTask(task._id, taskData);

//     } else {

//       createTask(taskData);

//     }

//   };

//   return (

//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">

//       <h2 className="text-xl font-bold mb-4">
//         {task ? "Edit Task" : "Create Task"}
//       </h2>

//       <input
//         className="border p-2 w-full mb-3 rounded"
//         placeholder="Task Title"
//         value={title}
//         onChange={(e)=>setTitle(e.target.value)}
//       />

//       <textarea
//         className="border p-2 w-full mb-3 rounded"
//         placeholder="Description"
//         value={description}
//         onChange={(e)=>setDescription(e.target.value)}
//       />

//       {/* DUE DATE */}
//       {/* <input
//         type="date"
//         className="border p-2 w-full mb-3 rounded"
//         value={dueDate}
//         onChange={(e)=>setDueDate(e.target.value)}
//       /> */}

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//       >
//         {task ? "Update Task" : "Add Task"}
//       </button>

//       <button
//         onClick={closeModal}
//         className="mt-2 text-gray-500 text-sm w-full"
//       >
//         Cancel
//       </button>

//     </div>

//   );

// }

import { useState, useEffect } from "react";

export default function TaskModal({
  createTask,
  updateTask,
  task,
  closeModal
}) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // EDIT MODE — prefill fields
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  // SUBMIT — same logic, zero change
  const handleSubmit = () => {
    const taskData = { title, description };
    if (task) {
      updateTask(task._id, taskData);
    } else {
      createTask(taskData);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tf-modal-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          outline: none;
        }
        .tf-modal-cancel:hover { background: #f3f4f6 !important; color: #374151 !important; }
        .tf-modal-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.35) !important; }
      `}</style>

      {/* OVERLAY */}
      <div
        onClick={closeModal}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* MODAL BOX — stop click from closing when clicking inside */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "32px 30px 28px",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 24,
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 3,
              }}>
                {task ? "Edit Task" : "New Task"}
              </h2>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                {task ? "Update the task details below" : "Fill in the details to create a task"}
              </p>
            </div>
            <button
              onClick={closeModal}
              style={{
                background: "#f3f4f6", border: "none", borderRadius: 8,
                width: 32, height: 32, cursor: "pointer",
                fontSize: 16, color: "#6b7280",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>

          {/* Title input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "#6b7280", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: 0.6,
            }}>Title</label>
            <input
              className="tf-modal-input"
              placeholder="e.g. Fix login bug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%", padding: "11px 13px",
                borderRadius: 10, border: "1px solid #e5e7eb",
                fontSize: 14, color: "#111827",
                background: "#fafafa", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description textarea */}
          <div style={{ marginBottom: 26 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "#6b7280", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: 0.6,
            }}>Description</label>
            <textarea
              className="tf-modal-input"
              placeholder="Optional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "11px 13px",
                borderRadius: 10, border: "1px solid #e5e7eb",
                fontSize: 14, color: "#111827",
                background: "#fafafa", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                resize: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="tf-modal-cancel"
              onClick={closeModal}
              style={{
                flex: 1, padding: "11px",
                borderRadius: 10, border: "1px solid #e5e7eb",
                background: "#fff", color: "#6b7280",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              Cancel
            </button>

            <button
              className="tf-modal-submit"
              onClick={handleSubmit}
              style={{
                flex: 2, padding: "11px",
                borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                transition: "all 0.2s",
              }}
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}