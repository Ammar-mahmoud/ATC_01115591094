const mongoose = require("mongoose");
const slugify = require("slugify");
const dotenv = require("dotenv");
const Category = require("../../models/categoryModel");

dotenv.config({ path: "config.env" });

// English/Arabic category list with fixed UUIDs
const sampleCategories = [
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-111111111111",
    name: { en: "Fitness", ar: "لياقة" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-222222222222",
    name: { en: "Technology", ar: "تكنولوجيا" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-333333333333",
    name: { en: "Business", ar: "أعمال" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-444444444444",
    name: { en: "Music", ar: "موسيقى" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-555555555555",
    name: { en: "Art", ar: "فني" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-666666666666",
    name: { en: "Health", ar: "صحة" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-777777777777",
    name: { en: "Education", ar: "تعليم" },
  },
  {
    _id: "8f41eeb3-b7d6-4b2a-9c94-888888888888",
    name: { en: "Travel", ar: "سفر" },
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ MongoDB connected for category seeding");

    await Category.deleteMany();

    const categoriesToInsert = sampleCategories.map((cat) => {
      const slug = slugify(cat.name.en, { lower: true });
      return {
        _id: cat._id,
        name: cat.name,
        slug,
        image: `${slug}.jpg`, // dummy image
      };
    });

    await Category.insertMany(categoriesToInsert);
    console.log("✅ Categories seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Category seeding failed", err);
    process.exit(1);
  }
}

seedCategories();
