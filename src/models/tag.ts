import { Document, Schema, model } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export type TagDocument = Document & {
  name: String;
  color: String;
  taskIds: [String];
  creator: {
    userId: String;
    nickname: String;
  };
};

export const TagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  taskIds: {
    type: [{ type: ObjectId, ref: 'Task' }],
    required: false,
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

const Tag = model<TagDocument>('Tag', TagSchema);
export default Tag;
