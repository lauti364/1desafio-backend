const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: function() {
      return new mongoose.Types.ObjectId().toString();
    }
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

ticketSchema.pre('save', function (next) {
  if (!this.code) {
    this.code = new mongoose.Types.ObjectId().toString();
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
