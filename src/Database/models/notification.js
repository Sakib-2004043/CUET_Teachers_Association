const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  teachersNotification: {
    type: Number,
    default: 0
  },
  adminsNotification: {
    type: Number,
    default: 0
  }
});

const Notifications = mongoose.models.Notifications || mongoose.model('Notifications', notificationSchema);

module.exports = Notifications;
