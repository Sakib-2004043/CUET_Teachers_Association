const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  role:{
    type: String,
  },
  profileImage: {
    type: Buffer, 
    default: null
  },
  notificationSeen: {
    type: Number,
    default: 0
  }
},{ timestamps: true });

const userRegistrations = mongoose.models.userRegistrations || mongoose.model('userRegistrations', userSchema);

module.exports = userRegistrations;
