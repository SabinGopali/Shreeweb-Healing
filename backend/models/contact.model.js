import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
