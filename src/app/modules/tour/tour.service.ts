import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

//query will be here
// i means type insensitive

// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;

//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;

//   //now calculate the skip
//   const skip = (page - 1) * limit;

//   //field filtering
//   const fields = query.fields?.split(",").join(" ") || "";

//   //object er jonne for in loop
//   for (const field of excludedFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchObject = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   //const tours = await Tour.find(searchObject).find(filter).sort(sort).select(fields).skip(skip).limit(limit); // -fields mane holo => oi field bad dia onno gula dekhabe

//   //using model query
//   const filterQuery = Tour.find(filter); //don't use await. neither it'll resolve the asynchronous call
//   const tours = filterQuery.find(searchObject);

//   const allTours = await tours
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const totalTours = await Tour.countDocuments();

//   const meta = {
//     page: page,
//     limit: limit,
//     totalItems: totalTours,
//     totalPage: Math.ceil(totalTours / limit),
//   };

//   //making a query builder

//   return {
//     data: allTours,
//     meta: meta,
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()

  // const meta = await queryBuilder.getMeta()

  // const [data, meta] = await Promise.all([
  //     tours.build(),
  //     queryBuilder.getMeta()
  // ])

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta()
  ])

  return {
    // data,
    meta,
    data,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  // if (payload.title) {
  //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
  //     let slug = `${baseSlug}`

  //     let counter = 0;
  //     while (await Tour.exists({ slug })) {
  //         slug = `${slug}-${counter++}` // dhaka-division-2
  //     }

  //     payload.slug = slug
  // }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true , runValidators: true});

  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name: payload.name });
};

const getAllTourTypes = async () => {
  return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourServices = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
