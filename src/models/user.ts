import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: String,
  password: String,
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
