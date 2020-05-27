import { TaskDocument, TaskSchema } from './task';
import { Schema, model, Document } from 'mongoose';

export type ShareDocument = Document & {
  tasks: [TaskDocument];
  senderId: String;
  createdAt: Date;
  updatedAt: Date;
};

const ShareSchema: Schema = new Schema(
  {
    tasks: {
      type: [TaskSchema],
      required: false,
    },
    senderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

ShareSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const Share = model<ShareDocument>('Share', ShareSchema);
export default Share;
