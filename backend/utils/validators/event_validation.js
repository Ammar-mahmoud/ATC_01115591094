const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

// ✅ Create Event Validator
exports.createEventValidator = [
  check("name.en")
    .notEmpty()
    .withMessage("English name is required")
    .isLength({ min: 3 })
    .withMessage("Too short event name"),

  check("name.ar")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short Arabic name"),

  check("description.en").optional(),
  check("description.ar").optional(),

  check("category")
  .optional()
  .isUUID().withMessage("Invalid category ID")
  .custom(async (val) => {
    const exists = await Category.findById(val);
    if (!exists) {
      throw new Error("Category not found");
    }
    return true;
  }),


  check("date")
    .notEmpty()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const inputDate = new Date(value);
      if (inputDate <= new Date()) {
        throw new Error("Date must be in the future");
      }
      return true;
    }),

  check("venue.en").notEmpty().withMessage("English venue is required"),
  check("venue.ar").optional(),

  check("price").optional().isNumeric().withMessage("Price must be a number"),

  check("ticketQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ticket quantity must be a non-negative integer"),

  check("tags.en")
    .optional()
    .isArray()
    .withMessage("tags.en must be an array")
    .custom((arr) => {
      if (
        !arr.every((tag) => typeof tag === "string" && tag.trim().length > 0)
      ) {
        throw new Error("Each tag in tags.en must be a non-empty string");
      }
      return true;
    }),

  check("tags.ar")
    .optional()
    .isArray()
    .withMessage("tags.ar must be an array")
    .custom((arr) => {
      if (
        !arr.every((tag) => typeof tag === "string" && tag.trim().length > 0)
      ) {
        throw new Error("Each tag in tags.ar must be a non-empty string");
      }
      return true;
    }),

  validatorMiddleware,
];

// ✅ Get Event by ID
exports.getEventValidator = [
  check("id").isUUID().withMessage("Invalid event ID format"),
  validatorMiddleware,
];

// ✅ Update Event
exports.updateEventValidator = [
  check("id").isUUID().withMessage("Invalid event ID format"),

  check("name.en")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short event name"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID")
    .custom(async (val) => {
      const exists = await Category.findById(val);
      if (!exists) {
        throw new Error("Category not found");
      }
    }),

  check("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const inputDate = new Date(value);
      if (inputDate <= new Date()) {
        throw new Error("Date must be in the future");
      }
      return true;
    }),

  check("venue.en").optional(),
  check("price").optional().isNumeric(),

  check("ticketQuantity").optional().isInt({ min: 0 }),
  check("soldTickets").optional().isInt({ min: 0 }),

  check("tags.en")
    .optional()
    .isArray()
    .withMessage("tags.en must be an array")
    .custom((arr) => {
      if (
        !arr.every((tag) => typeof tag === "string" && tag.trim().length > 0)
      ) {
        throw new Error("Each tag in tags.en must be a non-empty string");
      }
      return true;
    }),

  check("tags.ar")
    .optional()
    .isArray()
    .withMessage("tags.ar must be an array")
    .custom((arr) => {
      if (
        !arr.every((tag) => typeof tag === "string" && tag.trim().length > 0)
      ) {
        throw new Error("Each tag in tags.ar must be a non-empty string");
      }
      return true;
    }),

  validatorMiddleware,
];

// ✅ Delete Event
exports.deleteEventValidator = [
  check("id").isUUID().withMessage("Invalid event ID format"),
  validatorMiddleware,
];
