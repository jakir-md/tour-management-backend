import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import { NextFunction } from "express";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

divisionSchema.pre("save", async function (next: NextFunction) {
    if (this.isModified("name")) {
        let slug = this.name?.toLowerCase().split(" ").join("-");
        slug = `${slug}-division`;
        this.slug = slug;
    }
    next();
});

divisionSchema.pre("findOneAndUpdate", async function(next:NextFunction){
    const division = this.getUpdate() as Partial<IDivision>; // I'll get the division to be updated
    if(division.name){
        let slug = division.name?.toLowerCase().split(" ").join("-");
        slug = `${slug}-division`;
        division.slug = slug;
    }
    this.setUpdate(division);
    next();
})

export const Division = model<IDivision>("Division", divisionSchema);
