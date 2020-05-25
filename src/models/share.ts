import { TaskDocument, TaskSchema } from './task';
import { Schema, model, Document } from 'mongoose';

export type ShareDocument = Document & {
  tasks: [TaskDocument];
  senderId: String;
  createdAt: Date;
};

const ShareSchema: Schema = new Schema({
  tasks: {
    type: [TaskSchema],
    required: false,
  },
  senderId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 10,
    required: false,
    default: Date.now,
  },
});

const Share = model<ShareDocument>('Share', ShareSchema);
export default Share;
