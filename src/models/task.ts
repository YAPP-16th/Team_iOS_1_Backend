import { Document, Schema, model } from 'mongoose';

export type TaskDocument = Document & {
  title: String;
  coordinates: [Number, Number];
  address: String;
  tag: {
    name: String;
    color: String;
  };
  memo: String;
  iconURL: String;
  isFinished: Boolean;
  isCheckedArrive: Boolean;
  isCheckedLeave: Boolean;
  createdDate: Date;
  dueDate: Date;
};

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: false,
    default: 'untitled',
  },
  coordinates: {
    type: [Number, Number],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  tag: {
    type: {
      name: String,
      color: String,
    },
    required: false,
    default: '',
  },
  memo: {
    type: String,
    required: false,
    default: '',
  },
  iconURL: {
    type: String,
    required: false,
    default: '',
  },
  isFinished: {
    type: Boolean,
    required: false,
    default: false,
  },
  isCheckedArrive: {
    type: Boolean,
    required: true,
  },
  isCheckedLeave: {
    type: Boolean,
    required: true,
  },
  createdDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: false,
    default: '',
  },
});

const Task = model<TaskDocument>('Task', TaskSchema);
export default Task;
