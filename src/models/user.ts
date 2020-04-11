import { Schema, model, Document } from 'mongoose';

export type UserDocument = Document & {
  userId: String;
  password: String;
  joinedDate: Date;
};

const UserSchema: Schema = new Schema({
  userId: String,
  password: String,
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

const User = model<UserDocument>('User', UserSchema);
export default User;