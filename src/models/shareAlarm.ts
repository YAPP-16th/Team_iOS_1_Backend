import { Schema, model, Document } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export type ShareAlarmDocument = Document & {
  tag: {
    name: String;
    color: String;
  };
  shareId: String;
  creator: {
    userId: String;
    nickame: String;
  };
};

const ShareAlarmSchema: Schema = new Schema({
  tag: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  shareId: {
    type: ObjectId,
    ref: 'Share',
    required: true,
  },
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
