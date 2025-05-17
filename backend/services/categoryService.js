const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");

// ✅ Get all categories
exports.getAllCategories = factory.getAll(Category, "Category", false);