import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
