import { Schema, model, Document, Model } from 'mongoose';
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
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    required: true,
    //deafult : 디폴트 이미지
  },
  taskIds: [
    {
      type: ObjectId,
      required: false,
      ref: 'Task',
    },
  ],
  token: {
    type: String,
    required: true,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

// static method
UserSchema.statics.findByUserId = function (userId: string) {
  return this.findOne({ userId });
};

// static method
UserSchema.statics.findByToken = function (token: string) {
  return this.findOne({ token });
};

export interface UserModel extends Model<UserDocument> {
  findByUserId(userId: string): Promise<UserDocument>;
  findByToken(token: string): Promise<UserDocument>;
}

const User = model<UserDocument, UserModel>('User', UserSchema);
export default User;
