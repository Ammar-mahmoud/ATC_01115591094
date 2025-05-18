const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");
const factory = require("./handlersFactory");
const { uploadFileToS3 } = require("../utils/s3");
const Booking = require("../models/bookingModel");
const ApiError = require("../utils/api_error");

// ✅ Create Event with optional image upload, then use factory
exports.createEvent = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageKey = await uploadFileToS3(req.file, "events");
    req.body.image = imageKey; // inject image key
  } else {
    return next(new ApiError(`No file founded`, 404));
  }

  return factory.createOne(Event)(req, res, next);
});

// Read single event (excludes soft deleted)
exports.getEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const query = Event.findOne({ _id: id }).populate("category");
  const event = await query.exec();

  if (!event) {
    return next(new ApiError(`No event found with ID ${id}`, 404));
  }

  let isBooked = false;

  if (req.user) {
    const userId = req.user._id;
    const bookedEvents = await Booking.find({ user: userId }).distinct("event");
    isBooked = bookedEvents.includes(event._id.toString());
  }

  res.status(200).json({
    data: {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...event.toObject(),
      isBooked,
    },
  });
});

exports.clientGetAllEvents = asyncHandler(async (req, res, next) => {
  const filter = { deletedAt: null };

  const events = await Event.find(filter).populate("category");

  let bookedEvents = [];

  if (req.user) {
    bookedEvents = await Booking.find({ user: req.user._id }).distinct("event");
    bookedEvents = bookedEvents.map((id) => id.toString());
  }

  const data = events.map((eventDoc) => {
    const event = typeof eventDoc.toObject === "function" ? eventDoc.toObject() : eventDoc;

    return {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...event,
      isBooked: bookedEvents.includes(event._id.toString()),
    };
  });

  res.status(200).json({
    results: data.length,
    data,
  });
});

// ✅ Update event (only if not soft deleted)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageKey = await uploadFileToS3(req.file, "events");
    req.body.image = imageKey;
  }

  return factory.updateOne(Event)(req, res, next);
});

// ✅ Soft delete event
exports.softDeleteEvent = factory.softDeleteOne(Event);
