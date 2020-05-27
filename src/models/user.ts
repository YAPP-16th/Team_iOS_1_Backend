import { Schema, model, Document, Model } from 'mongoose';
import Frequent, { FrequentDocument, FrequentSchema } from './frequent';
import { TaskDocument } from './task';
import { TagDocument } from './tag';

const ObjectId = Schema.Types.ObjectId;

const arrayLimit = (frequents: Array<FrequentDocument>) => {
  return frequents.length <= 5;
};

export type UserDocument = Document & {
  userId: String;
  nickname: String;
  profileImageUrl: String;
  taskIds: [String];
  frequentIds: [String];
  tagIds: [String];
  shareIds: [String];
  shareAlarmIds: [String];
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
    required: false,
    default: 'default',
  },
  taskIds: {
    type: [{ type: ObjectId, ref: 'Task' }],
    required: false,
  },
  frequentIds: {
    type: [{ type: ObjectId, ref: 'Frequent' }],
    required: false,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  tagIds: {
    type: [{ type: ObjectId, ref: 'Tag' }],
    required: false,
  },
  shareIds: {
    type: [{ type: ObjectId, ref: 'Share' }],
    required: false,
  },
  shareAlarmIds: {
    type: [{ type: ObjectId, ref: 'ShareAlarm' }],
    required: false,
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
