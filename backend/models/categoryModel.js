const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      en: {
        type: String,
        required: [true, "Category name (EN) is required"],
        trim: true,
        minLength: [3, "Too short"],
        maxLength: [32, "Too long"],
      },
      ar: {
        type: String,
        required: [true, "Category name (AR) is required"],
        trim: true,
        minLength: [3, "Too short"],
        maxLength: [32, "Too long"],
      },
    },
    image: { type: String, default: null },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for full image URL
categorySchema.virtual("imageUrl").get(function () {
  if (!this.image) return null;
  return `${process.env.DIGITAL_OCEAN_BASE_URL}categories/${this.image}`;
});

module.exports = mongoose.model("Category", categorySchema);
