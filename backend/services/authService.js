const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../utils/api_error");
const createToken = require("../utils/createToken");

// ✅ Sign Up
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, gender } = req.body;

  const user = await User.create({ name, email, password, gender });

  const token = createToken({ id: user._id, role: user.role });
  user.jwtToken = token;
  await user.save();

  res.status(201).json({
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// ✅ Login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  if (user.deletedAt) {
    return next(new ApiError("Account is suspended or deleted", 403));
  }

  const token = createToken({ id: user._id, role: user.role });
  user.jwtToken = token;
  await user.save();

  res.status(200).json({
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// ✅ Protect Middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findOne({ _id: decoded.id }).select("+jwtToken");
  if (!currentUser) {
    return next(new ApiError("The user does not exist", 401));
  }

  // ✅ Check token matches stored token
  if (currentUser.jwtToken !== token) {
    return next(new ApiError("Invalid or expired token. Please log in again.", 401));
  }

  // ✅ Check if password was changed after token issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    if (changedTimestamp > decoded.iat) {
      return next(new ApiError("Password recently changed. Please log in again.", 401));
    }
  }

  req.user = currentUser;
  next();
});

// ✅ Logout
exports.logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError("User not found", 404));

  user.jwtToken = null;
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Role-Based Authorization
exports.allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Forbidden: Access denied", 403));
    }
    next();
  });
