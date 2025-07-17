import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>({
    name: {type: String, required: true, unique: true}
}, {
    timestamps: true
})

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>({
    title: {type:String, required: true, unique: true}, //by default mongoose fields are not required.
    slug: {type: String},
    description: {type: String},
    location: {type: String},
    images: {type: [String]},
    startDate: Date,
    endDate: Date,
    amenities: {type:[String]},
    costFrom: {type:Number},
    maxGuests: {type: Number},
    excluded: {type:[String]},
    included: {type:[String]},
    tourPlan: {type: [String]},
    minAge: {type: Number},
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division" //like foreign keys
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType"
    }
}, {
    timestamps: true
})

export const Tour = model<ITour>("Tour", tourSchema);