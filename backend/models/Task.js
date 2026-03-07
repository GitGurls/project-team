// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     // status: {
//     //   type: String,
//     //   enum: ["pending", "in-progress", "completed"],
//     //   default: "pending",
//     // },

//     status: {
//   type: String,
//   enum: ["todo","in-progress","done"],
//   default: "todo"
// },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// const Task = mongoose.model("Task", taskSchema);

// export default Task;

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    dueDate: {
      type: Date
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;