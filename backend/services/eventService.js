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
  }
  else {
    return next(new ApiError(`No file founded`, 404));
  }

  return factory.createOne(Event)(req, res, next);
});

// Read single event (excludes soft deleted)
exports.getEvent = asyncHandler(async (req, res, next) => {
  const baseHandler = factory.getOne(Event, "Event",{ path: "category" });

  await baseHandler(req, res, async () => {
    if (!req.user) return; // skip if not authenticated

    const userId = req.user._id;
    const bookedEvents = await Booking.find({ user: userId }).distinct("event");

    res.json({
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...res.locals.responsePayload,
      data: {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...res.locals.responsePayload.data,
        isBooked: bookedEvents.includes(res.locals.responsePayload.data._id),
      },
    });
  });
});

exports.clientGetAllEvents = asyncHandler(async (req, res, next) => {
  const baseHandler = factory.getAll(Event, "Event", true, { path: "category" });

  await baseHandler(req, res, async () => {
    if (!req.user) return; // skip if not authenticated

    const userId = req.user._id;
    const bookedEvents = await Booking.find({ user: userId }).distinct("event");

    // Inject isBooked to each event
    res.json({
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...res.locals.responsePayload,
      data: res.locals.responsePayload.data.map((event) => ({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...event,
        isBooked: bookedEvents.includes(event._id),
      })),
    });
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
