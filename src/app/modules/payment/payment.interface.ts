/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID="PAID",
    UNPAID="UNPAID",
    REFUNDED="REFUNDED",
    FAILED="FAILED",
    CANCELLED="CANCELLED"
}

export interface IPayment {
    booking: Types.ObjectId,
    paymentGatewayData?: any,
    inviceURL?:string,
    transactionID: string,
    amount:number,
    status: PAYMENT_STATUS
}