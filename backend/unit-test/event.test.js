/* eslint-env jest */
const {
  createEvent,
  updateEvent,
  clientGetAllEvents,
} = require("../services/eventService");

const factory = require("../services/handlersFactory");
const { uploadFileToS3 } = require("../utils/s3");
const Booking = require("../models/bookingModel");
const ApiError = require("../utils/api_error");

jest.mock("../utils/s3");
jest.mock("../services/handlersFactory");
jest.mock("../models/bookingModel");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

describe("Event services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should upload file and call createOne", async () => {
      const mockHandler = jest.fn();
      factory.createOne.mockReturnValue(mockHandler);
      uploadFileToS3.mockResolvedValue("s3-image-key");

      const req = { file: { buffer: Buffer.from("img") }, body: {} };
      const res = mockRes();
      const next = jest.fn();

      await createEvent(req, res, next);

      expect(uploadFileToS3).toHaveBeenCalledWith(req.file, "events");
      expect(req.body.image).toBe("s3-image-key");
      expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    });

    it("should return error if no file provided", async () => {
      const req = { body: {} };
      const res = mockRes();
      const next = jest.fn();

      await createEvent(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe("updateEvent", () => {
    it("should upload image and call updateOne", async () => {
      const mockHandler = jest.fn();
      factory.updateOne.mockReturnValue(mockHandler);
      uploadFileToS3.mockResolvedValue("updated-image-key");

      const req = { file: {}, body: {}, params: { id: "1" } };
      const res = mockRes();
      const next = jest.fn();

      await updateEvent(req, res, next);

      expect(uploadFileToS3).toHaveBeenCalledWith(req.file, "events");
      expect(req.body.image).toBe("updated-image-key");
      expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    });

    it("should skip image upload if no file", async () => {
      const mockHandler = jest.fn();
      factory.updateOne.mockReturnValue(mockHandler);

      const req = { body: {}, params: { id: "1" } };
      const res = mockRes();
      const next = jest.fn();

      await updateEvent(req, res, next);

      expect(uploadFileToS3).not.toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("clientGetAllEvents", () => {
    it("should inject isBooked into response", async () => {
      const req = { user: { _id: "user-id" }, query: {} };
      const res = mockRes();
      res.locals.responsePayload = {
        data: [{ _id: "1" }, { _id: "2" }],
      };

      const mockHandler = jest
        .fn()
        .mockImplementation((_req, _res, next) => next());
      factory.getAll.mockReturnValue(mockHandler);
      Booking.find.mockReturnValue({
        distinct: jest.fn().mockResolvedValue(["1"]),
      });

      await clientGetAllEvents(req, res);

      expect(Booking.find).toHaveBeenCalledWith({ user: "user-id" });
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { _id: "1", isBooked: true },
          { _id: "2", isBooked: false },
        ],
      });
    });

    it("should skip booking logic if no user", async () => {
      const req = {};
      const res = mockRes();
      res.locals.responsePayload = {
        data: [{ _id: "1" }],
      };

      const mockHandler = jest.fn().mockImplementation((_req, _res, _next) => {
        res.json(res.locals.responsePayload); // ✅ simulate real response
      });

      factory.getAll.mockReturnValue(mockHandler);

      await clientGetAllEvents(req, res);

      expect(res.json).toHaveBeenCalledWith(res.locals.responsePayload);
    });
  });
});
