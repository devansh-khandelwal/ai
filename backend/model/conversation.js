import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export { Conversation };
