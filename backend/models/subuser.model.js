import mongoose from 'mongoose';

const subuserSchema = new mongoose.Schema({
  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  permissions: [{
    type: String
  }]
}, {
  timestamps: true
});

const SubUser = mongoose.model('SubUser', subuserSchema);

export default SubUser;
