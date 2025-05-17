const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Event = require("../../models/eventModel");
const Booking = require("../../models/bookingModel");

exports.createBookingValidator = [
  check("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .custom(async (val) => {
      const event = await Event.findOne({ _id: val, deletedAt: null });
      if (!event) {
        throw new Error("Event not found or has been deleted");
      }
    }),

  body() // dummy validator to hook into the chain
    .custom(async (_, { req }) => {
      const userId = req.user._id;
      const { eventId } = req.params;

      const existingBooking = await Booking.findOne({
        user: userId,
        event: eventId,
      });

      if (existingBooking) {
        throw new Error("User has already booked this event");
      }
      return true;
    }),

  validatorMiddleware,
];

// ✅ Get Booking by ID
exports.getBookingValidator = [
  check("id").notEmpty().withMessage("booking ID is required"),
  validatorMiddleware,
];

// ✅ Delete Booking by ID
exports.deleteBookingValidator = [
  check("id").notEmpty().withMessage("booking ID is required"),
  validatorMiddleware,
];
