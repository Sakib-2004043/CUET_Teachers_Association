const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  complain: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reply: {
    type: String,
    default: "Waiting For Reply......"
  }
});

const Complains = mongoose.models.Complains || mongoose.model('Complains', complainSchema);

module.exports = Complains;
