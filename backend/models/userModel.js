const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: { type: String, enum: ["Male", "Female"], default: null },
    jwtToken: { type: String, select: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});


const User = mongoose.model("User", userSchema);
module.exports = User;
