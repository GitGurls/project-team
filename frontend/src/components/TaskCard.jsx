
// import { FaTrash } from "react-icons/fa";

// export default function TaskCard({ task, deleteTask, updateStatus }) {

//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 mb-3 hover:shadow-lg transition">

//       <div className="flex justify-between items-start">

//         <h3 className="font-semibold text-lg">
//           {task.title}
//         </h3>

//         <FaTrash
//           className="text-red-500 cursor-pointer"
//           onClick={()=>deleteTask(task._id)}
//         />

//       </div>

//       <p className="text-gray-500 text-sm mt-2">
//         {task.description}
//       </p>

//       <select
//         className="mt-3 border p-1 rounded w-full"
//         value={task.status}
//         onChange={(e)=>updateStatus(task._id,e.target.value)}
//       >
//         <option value="todo">Todo</option>
//         <option value="in-progress">In Progress</option>
//         <option value="done">Done</option>
//       </select>

//     </div>
//   );
// }


import { FaTrash } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, deleteTask, updateStatus }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl shadow-md p-4 mb-3 hover:shadow-lg transition cursor-grab"
    >

      <div className="flex justify-between items-start">

        <h3 className="font-semibold text-lg">
          {task.title}
        </h3>

        <FaTrash
          className="text-red-500 cursor-pointer"
          onClick={()=>deleteTask(task._id)}
        />

      </div>

      <p className="text-gray-500 text-sm mt-2">
        {task.description}
      </p>

      <select
        className="mt-3 border p-1 rounded w-full"
        value={task.status}
        onChange={(e)=>updateStatus(task._id,e.target.value)}
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

    </div>
  );
}