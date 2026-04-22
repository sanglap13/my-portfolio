import mongoose from 'mongoose';

const ContactRequestSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true,
    enum: ['resume', 'email', 'message']
  },
  senderEmail: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
  },
  starred: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequestSchema);
