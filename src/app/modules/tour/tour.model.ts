import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import { NextFunction } from "express";

const tourTypeSchema = new Schema<ITourType>({
    name: {type: String, required: true, unique: true}
}, {
    timestamps: true,
    versionKey: false
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
    },
    departureLocation: {type: String},
    arrivalLocation: {type: String}
}, {
    timestamps: true,
    versionKey: false
})


tourSchema.pre("save", async function (next: NextFunction) {
    if (this.isModified("title")) {
        let slug = this.title?.toLowerCase().split(" ").join("-");
        slug = `${slug}-tour`;
        this.slug = slug;
    }
    next();
});

tourSchema.pre("findOneAndUpdate", async function(next:NextFunction){
    const tour = this.getUpdate() as Partial<ITour>; // I'll get the tour to be updated
    if(tour.title){
        let slug = tour.title?.toLowerCase().split(" ").join("-");
        slug = `${slug}-tour`;
        tour.slug = slug;
    }
    this.setUpdate(tour);
    next();
});

export const Tour = model<ITour>("Tour", tourSchema);