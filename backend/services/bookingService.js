const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const factory = require("./handlersFactory");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const ApiError = require("../utils/api_error");

// ✅ Create booking
exports.createBooking = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user._id; // ✅ take it from token

    const event = await Event.findOne({
      _id: eventId,
      deletedAt: null,
    }).session(session);

    if (!event) {
      throw new ApiError("Event not found", 404);
    }

    if (
      event.ticketQuantity > 0 &&
      event.soldTickets + 1 > event.ticketQuantity
    ) {
      throw new ApiError("Not enough tickets available for this event", 400);
    }

    const booking = await Booking.create(
      [
        {
          user: userId,
          event: eventId,
          priceAtBooking: event.price,
        },
      ],
      { session }
    );

    event.soldTickets += 1;
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    if (global.io) {
      global.io.emit("newBooking", {
        user: userId,
        eventId,
        bookedAt: new Date(),
      });
    }

    res.status(201).json({ data: booking[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("event");
  res.status(200).json({ results: bookings.length, data: bookings });
});

// ✅ Get a single booking (admin or user)
exports.getBooking = factory.getOne(Booking, { path: "event" });

// ✅ Admin: Get all bookings with event and user details
exports.getAllBookings = factory.getAll(Booking, "Booking", false, [
  { path: "user" },
  { path: "event" },
]);

// ✅ Delete booking
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // dont delete if event is ended
  const booking = await Booking.findById(id);
  const event = await Event.findById(booking.event);
  if (event.date < Date.now()) {
    return next(
      new ApiError(
        "Cannot delete booking for an event that has already occurred",
        400
      )
    );
  }
  // update sold tickets
  const eventToUpdate = await Event.findById(booking.event);
  eventToUpdate.soldTickets -= 1;
  await eventToUpdate.save();
  // delete booking
  await Booking.findByIdAndDelete(id);
  res.status(204).send();
});
