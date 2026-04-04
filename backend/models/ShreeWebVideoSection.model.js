import mongoose from 'mongoose';

const shreeWebVideoSectionSchema = new mongoose.Schema({
  videoImage: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  youtubeRedirectUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cta1Text: {
    type: String,
    required: true
  },
  cta2Text: {
    type: String,
    required: true
  },
  cta1Link: {
    type: String,
    default: '/shreeweb/booking?plan=discovery'
  },
  cta2Link: {
    type: String,
    default: '/shreeweb/booking?plan=session'
  },
  socialLinks: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const ShreeWebVideoSection = mongoose.model('ShreeWebVideoSection', shreeWebVideoSectionSchema);

export default ShreeWebVideoSection;