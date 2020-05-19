import { TagDocument, TagSchema } from './tag';
import { Schema, model, Document } from 'mongoose';

export type ShareAlarmDocument = Document & {
  tag: TagDocument;
  creator: {
    userId: String;
    nickame: String;
  };
};

const ShareAlarmSchema: Schema = new Schema({
  tag: TagSchema,
  creator: {
    userId: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
  },
});

const ShareAlarm = model<ShareAlarmDocument>('ShareAlarm', ShareAlarmSchema);
export default ShareAlarm;
