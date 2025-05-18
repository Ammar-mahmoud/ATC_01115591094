const express = require("express");
const {
  createEventValidator,
  getEventValidator,
  updateEventValidator,
  deleteEventValidator,
} = require('../utils/validators/event_validation');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all active events (client view)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available events
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Admin - Create new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name.en, date, price]
 *             properties:
 *               name.en:
 *                 type: string
 *               name.ar:
 *                 type: string
 *               description.en:
 *                 type: string
 *               description.ar:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               venue.en:
 *                 type: string
 *               venue.ar:
 *                 type: string
 *               price:
 *                 type: number
 *               ticketQuantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Admin - Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name.en:
 *                 type: string
 *               name.ar:
 *                 type: string
 *               description.en:
 *                 type: string
 *               description.ar:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               venue.en:
 *                 type: string
 *               venue.ar:
 *                 type: string
 *               price:
 *                 type: number
 *               ticketQuantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Admin - Soft delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted
 *       403:
 *         description: Unauthorized
 */

const {
  createEvent,
  getEvent,
  updateEvent,
  softDeleteEvent,
  clientGetAllEvents,
} = require("../services/eventService");

const upload = require("../middlewares/uploadMiddleware");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();
router.use(protect);

// ✅ Public - Get all events for client
router.get("/", clientGetAllEvents);

// ✅ Admin - Create event (with image upload)
router.post(
  "/",
  allowedTo("admin"),
  upload.single("image"),
  createEventValidator,
  createEvent
);

// ✅ Public - Get one event
router.get("/:id", getEventValidator, getEvent);

// ✅ Admin - Update event
router.put(
  "/:id",
  allowedTo("admin"),
  upload.single("image"),
  updateEventValidator,
  updateEvent
);

// ✅ Admin - Soft delete event
router.delete(
  "/:id",
  allowedTo("admin"),
  deleteEventValidator,
  softDeleteEvent
);

module.exports = router;
