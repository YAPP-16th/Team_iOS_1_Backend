import { TaskDocument, TaskSchema } from './task';
import { Schema, model, Document } from 'mongoose';

export type ShareDocument = Document & {
  tasks: [TaskDocument];
  senderId: String;
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
});

const Share = model<ShareDocument>('Share', ShareSchema);
export default Share;
