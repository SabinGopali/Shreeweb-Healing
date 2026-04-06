import mongoose from 'mongoose';

const shreeWebOfferingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['introductory', 'single', 'recurring', 'program'],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  features: [{
    type: String,
    trim: true
  }],
  /** Optional Shopify Admin numeric product id for Storefront Cart / checkout (per offering). */
  shopifyProductId: {
    type: String,
    trim: true,
    default: ''
  },
  /** Optional Shopify variant id (numeric or gid) when a product has multiple variants. */
  shopifyVariantId: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  }
}, {
  timestamps: true
});

// Index for efficient queries
shreeWebOfferingSchema.index({ category: 1, order: 1, isActive: 1 });
shreeWebOfferingSchema.index({ featured: 1, isActive: 1 });

const ShreeWebOffering = mongoose.model('ShreeWebOffering', shreeWebOfferingSchema);

export default ShreeWebOffering;