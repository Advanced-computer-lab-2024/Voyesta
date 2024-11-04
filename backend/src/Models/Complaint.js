const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  reply: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
  replies: [replySchema]
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;