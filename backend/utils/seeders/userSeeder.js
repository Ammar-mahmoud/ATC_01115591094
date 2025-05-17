const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModel");

dotenv.config({ path: "config.env" });

async function seedUsers() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ MongoDB connected for user seeding");

    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("12345678", 12);

    const users = [
      {
        _id: uuidv4(),
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      },
      {
        _id: uuidv4(),
        name: "Client User",
        email: "client@example.com",
        password: hashedPassword,
        role: "user",
        isVerified: true,
      },
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ User seeding failed", err);
    process.exit(1);
  }
}

seedUsers();
