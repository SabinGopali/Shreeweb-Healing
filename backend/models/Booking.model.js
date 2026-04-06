import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Shopify Order Information
    shopifyOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    shopifyOrderNumber: {
      type: Number,
      required: true,
    },
    checkoutToken: {
      type: String,
    },

    // Customer Information
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
    },

    // Order Details
    productTitle: {
      type: String,
      required: true,
    },
    productVariant: {
      type: String,
    },
    productSku: {
      type: String,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },

    // Booking Details
    bookingDate: {
      type: Date,
    },
    bookingTime: {
      type: String,
    },
    bookingTimezone: {
      type: String,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    bookingNotes: {
      type: String,
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'partially_refunded'],
      default: 'paid',
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },

    // Confirmation
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    reminderEmailSent: {
      type: Boolean,
      default: false,
    },

    // Metadata
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ shopifyOrderId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
