import { Date, Types } from "mongoose";

export interface ITourType {
    name: string;
}

export interface ITour {
    title: string;
    slug: string;
    description?:string;
    images?:string[];
    location?:string;
    costFrom?:number;
    excluded?:string[];
    included?:string[];
    tourPlan?:string[];
    startDate?: Date;
    endDate?: Date;
    amenities?: string[];
    maxGuests?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;
}