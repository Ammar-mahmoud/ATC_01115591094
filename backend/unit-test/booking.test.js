/* eslint-env jest */
const mongoose = require("mongoose");
const {
  createBooking,
  getMyBookings,
  deleteBooking,
} = require("../services/bookingService");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");
const ApiError = require("../utils/api_error");

jest.mock("../models/bookingModel");
jest.mock("../models/eventModel");

jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...actualMongoose,
    startSession: jest.fn(),
  };
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Booking Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create booking and emit socket", async () => {
      const session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };
      mongoose.startSession = jest.fn().mockResolvedValue(session);

      // Mock Event
      const eventMock = {
        price: 100,
        ticketQuantity: 10,
        soldTickets: 3,
        save: jest.fn().mockResolvedValue(true),
      };
      Event.findOne.mockReturnValue({
        session: jest.fn().mockResolvedValue(eventMock),
      });

      // Mock Booking
      Booking.create.mockResolvedValue([{ _id: "b1" }]);

      // Request and Response
      const req = {
        params: { eventId: "e1" },
        user: { _id: "u1", name: "Ali" },
        body: {},
      };
      const res = mockRes();
      const next = jest.fn();

      // Mock socket
      global.io = { emit: jest.fn() };

      await createBooking(req, res, next);

      expect(Event.findOne).toHaveBeenCalledWith({
        _id: "e1",
        deletedAt: null,
      });
      expect(Booking.create).toHaveBeenCalled();
      expect(global.io.emit).toHaveBeenCalledWith("newBooking", {
        user: "u1", // 👈 Corrected
        eventId: "e1",
        bookedAt: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { _id: "b1" } });
    });

    it("should fail if not enough tickets", async () => {
      const session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };
      mongoose.startSession = jest.fn().mockResolvedValue(session);

      const eventMock = {
        price: 100,
        ticketQuantity: 5,
        soldTickets: 5,
        save: jest.fn(), // 👈 MUST mock it even if not called
      };

      Event.findOne.mockReturnValue({
        session: jest.fn().mockResolvedValue(eventMock),
      });

      const req = {
        params: { eventId: "e1" },
        user: { _id: "u1" },
        body: {},
      };
      const res = mockRes();
      const next = jest.fn();

      await createBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(session.abortTransaction).toHaveBeenCalled();
    });
  });

  describe("getMyBookings", () => {
    it("should return user bookings", async () => {
      const req = { user: { _id: "u1" } };
      const res = mockRes();
      const bookings = [{ _id: "b1" }, { _id: "b2" }];

      Booking.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(bookings),
      });

      await getMyBookings(req, res);

      expect(Booking.find).toHaveBeenCalledWith({ user: "u1" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        results: 2,
        data: bookings,
      });
    });
  });

  describe("deleteBooking", () => {
    it("should delete booking if event is in future", async () => {
      const req = { params: { id: "b1" } };
      const res = mockRes();
      const next = jest.fn();

      const eventDate = Date.now() + 100000;
      const booking = { event: "e1" };
      const event = { date: eventDate, soldTickets: 2, save: jest.fn() };

      Booking.findById.mockResolvedValue(booking);
      Event.findById
        .mockResolvedValueOnce(event) // check if in future
        .mockResolvedValueOnce(event); // update ticket count
      Booking.findByIdAndDelete.mockResolvedValue(true);

      await deleteBooking(req, res, next);

      expect(event.soldTickets).toBe(1);
      expect(Event.findById).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should not delete if event is already passed", async () => {
      const req = { params: { id: "b1" } };
      const res = mockRes();
      const next = jest.fn();

      const eventDate = Date.now() - 100000;
      const booking = { event: "e1" };
      const event = { date: eventDate };

      Booking.findById.mockResolvedValue(booking);
      Event.findById.mockResolvedValue(event);

      await deleteBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });
});
