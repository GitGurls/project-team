
// import { FaTrash, FaEdit } from "react-icons/fa";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// export default function TaskCard({
//   task,
//   deleteTask,
//   updateStatus,
//   editTask
// }) {

//   // DRAG & DROP ENABLE
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition
//   } = useSortable({ id: task._id });

//   // DRAG STYLE APPLY
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition
//   };

//   // DELETE TASK
//   const handleDelete = (e) => {
//     e.stopPropagation(); // drag conflict avoid
//     deleteTask(task._id);
//   };

//   // EDIT TASK
//   const handleEdit = (e) => {
//     e.stopPropagation(); // drag conflict avoid
//     editTask(task);
//   };

//   // STATUS CHANGE
//   const handleStatusChange = (e) => {
//     updateStatus(task._id, e.target.value);
//   };

//   // // SAFE DATE FORMAT
//   // const formattedDate = task?.dueDate
//   //   ? new Date(task.dueDate).toLocaleDateString("en-GB")
//   //   : "No due date";

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="bg-white rounded-xl shadow-md p-4 mb-3 hover:shadow-lg transition"
//     >

//       {/* HEADER */}
//       <div className="flex justify-between items-start">

//         {/* TITLE + DRAG HANDLE */}
//         <h3
//           {...attributes}
//           {...listeners}
//           className="font-semibold text-lg cursor-grab"
//         >
//           {task.title}
//         </h3>

//         {/* ACTION BUTTONS */}
//         <div className="flex gap-3">

//           {/* EDIT BUTTON */}
//           <FaEdit
//             className="text-blue-500 cursor-pointer hover:text-blue-700"
//             onClick={handleEdit}
//           />

//           {/* DELETE BUTTON */}
//           <FaTrash
//             className="text-red-500 cursor-pointer hover:text-red-700"
//             onClick={handleDelete}
//           />

//         </div>
//       </div>

//       {/* DESCRIPTION */}
//       <p className="text-gray-500 text-sm mt-2">
//         {task.description || "No description"}
//       </p>

//       {/* DUE DATE */}
//       {/* <p className="text-xs text-gray-400 mt-1">
//         📅 Due: {formattedDate}
//       </p> */}

//       {/* STATUS DROPDOWN */}
//       <select
//         className="mt-3 border p-1 rounded w-full"
//         value={task.status}
//         onChange={handleStatusChange}
//       >
//         <option value="todo">Todo</option>
//         <option value="in-progress">In Progress</option>
//         <option value="done">Done</option>
//       </select>

//     </div>
//   );
// }


import { FaTrash, FaEdit } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function TaskCard({
  task,
  deleteTask,
  updateStatus,
  editTask
}) {

  const [hovered, setHovered] = useState(false);

  // DRAG & DROP ENABLE
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task._id });

  // DRAG STYLE APPLY
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // DELETE TASK
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  // EDIT TASK
  const handleEdit = (e) => {
    e.stopPropagation();
    editTask(task);
  };

  // STATUS CHANGE
  const handleStatusChange = (e) => {
    updateStatus(task._id, e.target.value);
  };

  const statusColors = {
    "todo":        { color: "#6366f1", bg: "#eef2ff" },
    "in-progress": { color: "#f59e0b", bg: "#fffbeb" },
    "done":        { color: "#22c55e", bg: "#f0fdf4" },
  };
  const sc = statusColors[task.status] || statusColors["todo"];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "#fff",
        border: `1px solid ${hovered ? "#6366f1" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 10,
        boxShadow: hovered
          ? "0 4px 20px rgba(99,102,241,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.2s",
        transform: hovered
          ? `${CSS.Transform.toString(transform) || ""} translateY(-1px)`
          : CSS.Transform.toString(transform),
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* HEADER — drag handle on title, action buttons separate */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>

        <h3
          {...attributes}
          {...listeners}
          style={{
            fontSize: 14, fontWeight: 700, color: "#111827",
            cursor: "grab", lineHeight: 1.4, flex: 1, marginRight: 10,
          }}
        >
          {task.title}
        </h3>

        <div style={{
          display: "flex", gap: 6,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
        }}>
          <button
            onClick={handleEdit}
            style={{
              background: "#eef2ff", border: "none", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#6366f1", fontSize: 12,
            }}
          >
            <FaEdit />
          </button>

          <button
            onClick={handleDelete}
            style={{
              background: "#fef2f2", border: "none", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#ef4444", fontSize: 12,
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p style={{
        fontSize: 12, color: "#9ca3af",
        marginBottom: 12, lineHeight: 1.5,
      }}>
        {task.description || "No description"}
      </p>

      {/* STATUS DROPDOWN */}
      <select
        value={task.status}
        onChange={handleStatusChange}
        style={{
          width: "100%", padding: "7px 10px", borderRadius: 8,
          border: `1px solid ${sc.color}40`,
          background: sc.bg, color: sc.color,
          fontSize: 12, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          outline: "none", cursor: "pointer",
          appearance: "auto",
        }}
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

    </div>
  );
}