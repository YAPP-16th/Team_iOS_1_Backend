import { Schema, model, Document, Model } from 'mongoose';
import Frequent, { FrequentDocument, FrequentSchema } from './frequent';
import { TaskDocument } from './task';
import { TagDocument } from './tag';

const ObjectId = Schema.Types.ObjectId;

const arrayLimit = (frequents: Array<FrequentDocument>) => {
  return frequents.length <= 5;
};

export type UserDocument = Document & {
  oauthId: String;
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
  auth: String;
};

const UserSchema: Schema = new Schema({
  oauthId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
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
  auth: {
    type: String,
    required: true,
  },
});

// static methods
UserSchema.statics.findByUserId = function (userId: string) {
  return this.findOne({ userId });
};

UserSchema.statics.findByOauthId = function (oauthId: string) {
  return this.findOne({ oauthId });
};

UserSchema.statics.findByToken = function (token: string) {
  return this.findOne({ token });
};

UserSchema.statics.findByAuthAndEmail = function (auth: string, email: string) {
  return this.findOne({ auth: auth, userId: email });
};

export interface UserModel extends Model<UserDocument> {
  // static methods
  findByUserId(userId: string): Promise<UserDocument>;
  findByOauthId(userId: string): Promise<UserDocument>;
  findByToken(token: string): Promise<UserDocument>;
  findByAuthAndEmail(auth: string, email: string): Promise<UserDocument>;
}

const User = model<UserDocument, UserModel>('User', UserSchema);
export default User;
