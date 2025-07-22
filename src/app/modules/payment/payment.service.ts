/* eslint-disable @typescript-eslint/no-explicit-any */
//if we use update on two different collections
//then we have to use transaction rollback

import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const successPayment = async (query: Record<string, string>) => {
  //update booking status to confirm
  //update payment status to paid

  const session = await Booking.startSession(); // for transaction start the virtual environment
  session.startTransaction();

  //findbyid or any get request a kono session / serveilance add korte hobe na
  //karon era DB te kono change ane na
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionID: query.transactionID },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETED },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const failPayment = async (query: Record<string, string>) => {
  //update booking status to fail
  //update payment status to fail

  const session = await Booking.startSession(); // for transaction start the virtual environment
  session.startTransaction();

  //findbyid or any get request a kono session / serveilance add korte hobe na
  //karon era DB te kono change ane na
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionID: query.transactionID },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();

    return { success: false, message: "Payment Failed.." };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  //update booking status to cancel
  //update payment status to caneel

  const session = await Booking.startSession(); // for transaction start the virtual environment
  session.startTransaction();

  //findbyid or any get request a kono session / serveilance add korte hobe na
  //karon era DB te kono change ane na
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionID: query.transactionID },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();

    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const initPayment = async (bookingId: string) => {
  //update booking status to cancel
  //update payment status to cancel

  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment not found. You have not booked this tour."
    );
  }

  const booking = await Booking.findById(bookingId);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    name: userName,
    email: userEmail,
    phoneNumber: userPhone,
    transactionID: payment.transactionID,
    amount: payment.amount,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload); //it'll return a url

  return {
    paymentURL: sslPayment.GatewayPageURL
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
