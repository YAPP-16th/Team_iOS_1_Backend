import { Document, Schema, model } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export type TaskDocument = Document & {
  title: String;
  coordinates: [Number, Number];
  address: String;
  tag: String;
  iconURL: String;
  isFinished: Boolean;
  isCheckedArrive: Boolean;
  isCheckedLeave: Boolean;
  arriveMessage: String;
  leaveMessage: String;
  createdDate: Date;
  dueDate: Date;
};

export const TaskSchema: Schema = new Schema({
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
    type: ObjectId,
    ref: 'Tag',
    required: false,
    default: null,
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
  arriveMessage: {
    type: String,
    required: true,
  },
  leaveMessage: {
    type: String,
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
