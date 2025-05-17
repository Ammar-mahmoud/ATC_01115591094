const express = require("express");
const {
  createBookingValidator,
  getBookingValidator,
  deleteBookingValidator,
} = require("../utils/validators/book_validation");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking operations
 */

/**
 * @swagger
 * /bookings/{eventId}:
 *   post:
 *     summary: Book an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID of the event to book
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketQuantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Booking created successfully
 */

/**
 * @swagger
 * /bookings/me:
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's bookings
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Admin - Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID (admin or owner)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete booking by ID (admin or owner)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       403:
 *         description: Unauthorized
 */

const {
  createBooking,
  getMyBookings,
  getBooking,
  getAllBookings,
  deleteBooking,
} = require("../services/bookingService");

const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

// ✅ Protected routes for authenticated users
router.use(protect);

// ✅ client Book an event
router.post("/:eventId", allowedTo("user"), createBookingValidator, createBooking);

// ✅ Get all bookings of the logged-in user
router.get("/me", getMyBookings);

// ✅ Admin: Get all bookings
router.get("/", allowedTo("admin"), getAllBookings);

// ✅ Admin/User: Get booking by ID
router.get("/:id", getBookingValidator, getBooking);

// ✅ Admin/User: Delete booking by ID
router.delete(
  "/:id",
  allowedTo("admin", "user"),
  deleteBookingValidator,
  deleteBooking
);

module.exports = router;
