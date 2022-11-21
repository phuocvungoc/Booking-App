const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Hotel",
  },
  hotel: {
    type: String,
    required: true,
  },
  rooms: {
    type: [Number],
    required: true,
  },
  roomsId: {
    type: [String],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
