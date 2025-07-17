import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IDivision } from "./division.interface"
import { Division } from "./division.model"

const createDivision = async(payload:Partial<IDivision>) => {

    const isDivisionExists = await Division.findOne({slug: payload.slug});

    if(isDivisionExists){
        throw new AppError(StatusCodes.BAD_REQUEST,"Division already exists");
    }

    const division = await Division.create(payload);
    const total = await Division.countDocuments();
    return {
        division,
        total
    }
}

const updateDivision = async(id:string, payload:Partial<IDivision>) => {
    const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
        new:true,
        runValidators: true
    })
    return {updatedDivision};
}


export const DivisionServices = {
    createDivision,
    updateDivision
}