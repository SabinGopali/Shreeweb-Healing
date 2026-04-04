import mongoose from 'mongoose';

const userManagementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const UserManagement = mongoose.model('UserManagement', userManagementSchema);

export default UserManagement;
