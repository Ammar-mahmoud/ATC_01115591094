/* eslint-env jest */
const {
  createOne,
  getOne,
  updateOne,
  softDeleteOne,
  getAll,
} = require("../services/handlersFactory");

const ApiError = require("../utils/api_error");

// Mock Response Object
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Factory Handlers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Create One
  it("createOne - should create a new document", async () => {
    const Model = {
      create: jest.fn().mockResolvedValue({ name: "Test" }),
    };
    const req = { body: { name: "Test" } };
    const res = mockRes();

    await createOne(Model)(req, res);
    expect(Model.create).toHaveBeenCalledWith({ name: "Test" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: { name: "Test" } });
  });

  // ✅ Get One
  it("should return document if found", async () => {
    const exec = jest.fn().mockResolvedValue({ _id: "1" });

    const Model = {
      findOne: jest.fn().mockReturnValue({ exec }),
    };

    const req = { params: { id: "1" } };
    const res = mockRes();
    const next = jest.fn();

    await getOne(Model)(req, res, next);

    expect(Model.findOne).toHaveBeenCalledWith({ _id: "1", deletedAt: null });
    expect(exec).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { _id: "1" } });
  });

  it("should return error if document not found", async () => {
    const exec = jest.fn().mockResolvedValue(null);

    const Model = {
      findOne: jest.fn().mockReturnValue({ exec }),
    };

    const req = { params: { id: "1" } };
    const res = mockRes();
    const next = jest.fn();

    await getOne(Model)(req, res, next);

    expect(exec).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  // ✅ Update One
  it("updateOne - should update document", async () => {
    const Model = {
      findOneAndUpdate: jest.fn().mockResolvedValue({ name: "Updated" }),
    };
    const req = { params: { id: "1" }, body: { name: "Updated" } };
    const res = mockRes();

    await updateOne(Model)(req, res, jest.fn());
    expect(Model.findOneAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { name: "Updated" } });
  });

  it("updateOne - should return error if not found", async () => {
    const Model = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
    };
    const req = { params: { id: "1" }, body: { name: "Updated" } };
    const res = mockRes();
    const next = jest.fn();

    await updateOne(Model)(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  // ✅ Soft Delete One
  it("softDeleteOne - should soft delete document", async () => {
    const Model = {
      findOneAndUpdate: jest.fn().mockResolvedValue({ _id: "1" }),
    };
    const req = { params: { id: "1" } };
    const res = mockRes();

    await softDeleteOne(Model)(req, res, jest.fn());
    expect(Model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "1", deletedAt: null },
      { deletedAt: expect.any(Number) },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("softDeleteOne - should return error if not found", async () => {
    const Model = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
    };
    const req = { params: { id: "1" } };
    const res = mockRes();
    const next = jest.fn();

    await softDeleteOne(Model)(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  // ✅ Get All
  it("getAll - should return list of documents", async () => {
    const mockData = [{ name: "Test1" }, { name: "Test2" }];

    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockData),
    };

    const Model = {
      find: jest.fn(() => mockQuery), // returns chainable object
      countDocuments: jest.fn().mockResolvedValue(2),
    };

    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    res.locals = {}; // ✅ ADD THIS LINE

    await getAll(Model, "Category")(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      results: mockData.length,
      paginationResult: expect.any(Object),
      data: mockData,
    });
  });
});
