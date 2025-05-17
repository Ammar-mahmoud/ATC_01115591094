const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    user: { type: String, ref: "User", required: true },
    event: { type: String, ref: "Event", required: true },
    priceAtBooking: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
