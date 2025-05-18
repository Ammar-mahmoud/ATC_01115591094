/* eslint-env jest */
const {
  createEvent,
  updateEvent,
} = require("../services/eventService");

const factory = require("../services/handlersFactory");
const { uploadFileToS3 } = require("../utils/s3");
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

});
