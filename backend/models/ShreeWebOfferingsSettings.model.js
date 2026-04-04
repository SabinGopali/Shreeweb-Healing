import mongoose from 'mongoose';

const offeringsSectionSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, default: 'Curated Offerings' },
    sectionDescription: {
      type: String,
      default: 'Select the container that aligns with your current capacity and desired expansion.',
    },
    backgroundColor: { type: String, default: '#F4EFE6' },
    cardBackground: { type: String, default: '#EDE7DC' },
  },
  { _id: false }
);

const offeringsAdditionalProgramSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    sessions: { type: String, default: '' },
  },
  { _id: false }
);

const offeringsAdditionalProgramsSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: 'Looking for deeper transformation?' },
    programs: { type: [offeringsAdditionalProgramSchema], default: [] },
  },
  { _id: false }
);

const shreeWebOfferingsSettingsSchema = new mongoose.Schema(
  {
    section: { type: offeringsSectionSchema, default: () => ({}) },
    additionalPrograms: { type: offeringsAdditionalProgramsSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebOfferingsSettings = mongoose.model(
  'ShreeWebOfferingsSettings',
  shreeWebOfferingsSettingsSchema
);

export default ShreeWebOfferingsSettings;

