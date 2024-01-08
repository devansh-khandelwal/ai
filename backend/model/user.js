import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

const userSchema = new mongoose.Schema({
  _id: Number,
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
},
  { _id: false }
);


//For autoIncrement of user ID
userSchema.plugin(autoIncrement(mongoose));

const User = mongoose.model("user", userSchema)
export { User };