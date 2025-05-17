const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api_error");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    // Trigger "remove" event when delete document
    document.delete();
    res.status(204).send();
  });

exports.softDeleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: Date.now() },
      { new: true }
    );

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      req.body,
      { new: true }
    );

    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findOne({ _id: id, deletedAt: null });
    if (populationOpt) query = query.populate(populationOpt);

     const document = await query.exec();
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "", isActiveOnly = true, populationOpt = null) =>
  asyncHandler(async (req, res) => {
    let filter = {};

    if (isActiveOnly) {
      filter.deletedAt = null;
    }

    if (req.filterObj) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      filter = { ...filter, ...req.filterObj };
    }

    const documentsCount = await Model.countDocuments(filter);

    let query = Model.find(filter);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const apiFeatures = new ApiFeatures(query, req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery.exec();

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
    // Attach the response payload to res.locals for further use
    res.locals.responsePayload = {
      results: documents.length,
      paginationResult,
      data: documents,
    };
  });

