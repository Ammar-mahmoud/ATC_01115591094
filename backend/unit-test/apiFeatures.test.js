/* eslint-env jest */
const ApiFeatures = require("../utils/apiFeatures");

describe("ApiFeatures Class", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
  });

  it("filter() should apply filtering on query", () => {
    const queryString = { price: { gte: 100 }, category: "books" };
    const features = new ApiFeatures(mockQuery, queryString);
    features.filter();

    expect(mockQuery.find).toHaveBeenCalledWith({
      price: { $gte: 100 },
      category: "books",
    });
  });

  it("sort() should apply sort from query string", () => {
    const queryString = { sort: "price,name" };
    const features = new ApiFeatures(mockQuery, queryString);
    features.sort();

    expect(mockQuery.sort).toHaveBeenCalledWith("price name");
  });

  it("sort() should apply default sort if no sort param", () => {
    const features = new ApiFeatures(mockQuery, {});
    features.sort();

    expect(mockQuery.sort).toHaveBeenCalledWith("-createAt");
  });

  it("limitFields() should select specific fields", () => {
    const queryString = { fields: "name,price" };
    const features = new ApiFeatures(mockQuery, queryString);
    features.limitFields();

    expect(mockQuery.select).toHaveBeenCalledWith("name price");
  });

  it("limitFields() should exclude __v by default", () => {
    const features = new ApiFeatures(mockQuery, {});
    features.limitFields();

    expect(mockQuery.select).toHaveBeenCalledWith("-__v");
  });

  it("search() should apply search filter for default model", () => {
    const queryString = { keyword: "test" };
    const features = new ApiFeatures(mockQuery, queryString);
    features.search("Category");

    expect(mockQuery.find).toHaveBeenCalledWith({
      name: { $regex: "test", $options: "i" },
    });
  });

  it("paginate() should apply pagination and return correct result", () => {
    const features = new ApiFeatures(mockQuery, { page: "2", limit: "10" });

    features.paginate(100); // total documents = 100

    expect(mockQuery.skip).toHaveBeenCalledWith(10);
    expect(mockQuery.limit).toHaveBeenCalledWith(10);
    expect(features.paginationResult).toEqual({
      currentPage: 2,
      limit: 10,
      numberOfPages: 10,
      totalDocuments: 100,
      prev: 1,
      next: 3,
    });
  });
});
