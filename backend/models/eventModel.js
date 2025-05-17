const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const eventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      en: { type: String, required: true },
      ar: { type: String },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    category: { type: String, ref: "Category" },
    slug: {
      type: String,
      lowercase: true,
    },
    date: { type: Date, required: true },
    venue: {
      name: {
        en: { type: String },
        ar: { type: String },
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: undefined,
        },
      },
    },

    price: { type: Number, default: 0 },
    image: { type: String },
    tags: {
      en: {
        type: [String],
        default: undefined,
      },
      ar: {
        type: [String],
        default: undefined,
      }
    },
    ticketQuantity: { type: Number, default: 0 }, // 0 = unlimited
    soldTickets: { type: Number, default: 0 }, // manually incremented
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.virtual("imageUrl").get(function () {
  if (!this.image) return null;
  return `${process.env.DIGITAL_OCEAN_BASE_URL}events/${this.image}`;
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
