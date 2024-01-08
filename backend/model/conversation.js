import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for your MongoDB object
const conversationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// Create the model using the schema
const Conversation = mongoose.model('Conversation', conversationSchema);
export { Conversation };
