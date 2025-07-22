import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const isDivisionExists = await Division.findOne({ name: payload.name });

  if (isDivisionExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Division already exists");
  }

  const division = await Division.create(payload); // .create() and .save() is a save hook
  const total = await Division.countDocuments();
  return {
    division,
    total,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isDivisionExists = await Division.findById(id);
  if (!isDivisionExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Division not found.");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Duplicate update found.");
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    //It triggers the findOneAndUpdate hook
    new: true,
    runValidators: true,
  });
  return { updatedDivision };
};

const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const getSingleDivision = async (slug:string) => {
  const divisions = await Division.findOne({slug});
  const totalDivisions = await Division.countDocuments();
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionServices = {
  createDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
  getAllDivisions
};
