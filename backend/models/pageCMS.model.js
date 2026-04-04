import mongoose from 'mongoose';

const pageCMSSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed
  },
  images: [{
    url: String,
    alt: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const PageCMS = mongoose.model('PageCMS', pageCMSSchema);

export default PageCMS;
