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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequestSchema);
