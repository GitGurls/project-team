// import { useState } from "react";

// export default function TaskModal({ createTask, closeModal }) {

//   const [title,setTitle] = useState("");
//   const [description,setDescription] = useState("");

//   const handleSubmit = ()=>{

//     if(!title){
//       alert("Title required");
//       return;
//     }

//     createTask(title,description);

//     setTitle("");
//     setDescription("");

//     closeModal();
//   };

//   return (

//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//       <div className="bg-white p-6 rounded-lg w-96">

//         <h2 className="text-xl font-bold mb-4">
//           Create Task
//         </h2>

//         <input
//           placeholder="Task Title"
//           className="border p-2 w-full mb-3"
//           value={title}
//           onChange={(e)=>setTitle(e.target.value)}
//         />

//         <textarea
//           placeholder="Description"
//           className="border p-2 w-full mb-4"
//           value={description}
//           onChange={(e)=>setDescription(e.target.value)}
//         />

//         <div className="flex justify-end gap-2">

//           <button
//             className="px-4 py-2 bg-gray-400 text-white rounded"
//             onClick={closeModal}
//           >
//             Cancel
//           </button>

//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={handleSubmit}
//           >
//             Create
//           </button>

//         </div>

//       </div>

//     </div>

//   );

// }

import { useState } from "react";

export default function TaskModal({createTask}) {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");

  const handleSubmit = ()=>{
    createTask(title,description);
    setTitle("");
    setDescription("");
  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-md mb-6">

      <h2 className="text-xl font-bold mb-4">
        Create Task
      </h2>

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Task Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3 rounded"
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Add Task
      </button>

    </div>

  );
}