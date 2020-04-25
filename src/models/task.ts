import { Document, Schema, model } from 'mongoose';

export type TaskDocument = Document & {
  title: String;
  coordinates: [Number, Number];
  address: String;
  tags: String;
  memo: String;
  iconURL: String;
  isFinished: Boolean;
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
  tags: {
    type: String,
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
