import { Schema, model, Document } from 'mongoose';
export const ObjectId = Schema.Types.ObjectId;

export type UserDocument = Document & {
  userId: String;
  nickname: String;
  profileImageUrl: String;
  taskIds: [String];
  token: String;
  joinedDate: Date;
};

const UserSchema: Schema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    required: true
    //deafult : 디폴트 이미지
  },
  taskIds: [
    {
      type: ObjectId,
      required: false,
      ref: 'Task',
    }
  ],
  token: {
    type: String,
    required: true
  },
  joinedDate: {
    type:Date,
    default:Date.now
  }
});

const User = model<UserDocument>('User', UserSchema);
export default User;