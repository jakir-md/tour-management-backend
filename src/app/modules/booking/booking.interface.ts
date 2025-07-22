// user --> booking(pending) --> payment(unpaid) --> sslcommerz --> booking update(completed) --> payment update(paid)

import { Types } from "mongoose";

export enum BOOKING_STATUS {
    COMPLETED="COMPLETED",
    CANCEL="CANCEL",
    PENDING="PENDING",
    FAILED="FAILED"
}

export interface IBooking {
    user:Types.ObjectId,
    tour:Types.ObjectId,
    payment?: Types.ObjectId,
    status: BOOKING_STATUS,
    guestCount: number
}