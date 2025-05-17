const factory = require("./handlersFactory");
const User = require("../models/userModel");

// ✅ Get all users
exports.getAllUsers = factory.getAll(User, "User", true);