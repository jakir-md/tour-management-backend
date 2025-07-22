import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    booking: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Booking",
        unique: true
    },
    transactionID: {
        type: String,
        unique: true,
        required: true,
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    inviceURL: {
        type: String,
    }
}, {
    versionKey:false,
    timestamps:true
});

export const Payment = model<IPayment>("Payment", paymentSchema);