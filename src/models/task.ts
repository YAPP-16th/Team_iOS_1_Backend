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
  isCheckedDepature: Boolean;
  isCheckedDueDate: Boolean;
  isReadyArrive: Boolean;
  isReadyDeparture: Boolean;
  arriveMessage: String;
  departureMessage: String;
  createdDate: String;
  dueDate: String;
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
  isCheckedDeparture: {
    type: Boolean,
    required: true,
  },
  isCheckedDueDate: {
    type: Boolean,
    required: true,
  },
  isReadyArrive: {
    type: Boolean,
    required: true,
  },
  isReadyDeparture: {
    type: Boolean,
    required: true,
  },
  arriveMessage: {
    type: String,
    required: false,
    default: '',
  },
  departureMessage: {
    type: String,
    required: false,
    default: '',
  },
  createdDate: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: false,
    default: '',
  },
});

const Task = model<TaskDocument>('Task', TaskSchema);
export default Task;
