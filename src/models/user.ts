import { Schema, model, Document, Model } from 'mongoose';
import Frequent, { FrequentDocument, FrequentSchema } from './frequent';

const ObjectId = Schema.Types.ObjectId;

const arrayLimit = (frequents: Array<FrequentDocument>) => {
  return frequents.length <= 5;
};

export type UserDocument = Document & {
  userId: String;
  nickname: String;
  profileImageUrl: String;
  taskIds: [String];
  frequents: [FrequentDocument];
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
  taskIds: {
    type: [ObjectId],
    required: false,
    ref: 'Task',
  },
  frequentIds: {
    type: [ObjectId],
    required: false,
    ref: 'Frequent',
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  token: {
    type: String,
    required: true,
  },
  joinedDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

// static methods
UserSchema.statics.findByUserId = function (userId: string) {
  return this.findOne({ userId });
};

UserSchema.statics.findByToken = function (token: string) {
  return this.findOne({ token });
};

export interface UserModel extends Model<UserDocument> {
  // static methods
  findByUserId(userId: string): Promise<UserDocument>;
  findByToken(token: string): Promise<UserDocument>;
}

const User = model<UserDocument, UserModel>('User', UserSchema);
export default User;
