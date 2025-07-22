/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelper/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import httpStatus from "http-status-codes";

const getTransactionId = () =>
  `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

/**
 * Duplicate DB Collections / replica
 *
 * Relica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB
 *  jodi maje kono error hoy tahoile DB bolbe atokkhon ja hoise sob vua. real DB te insert hobe na
 *  ager gula sob bari jao
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const user = await User.findById(userId);
  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update Your Profile to book a tour."
    );
  }

  const session = await Booking.startSession(); // for transaction start the virtual environment
  session.startTransaction();

  //findbyid or any get request a kono session / serveilance add korte hobe na
  //karon era DB te kono change ane na
  try {
    const booking = await Booking.create([{
      user: userId,
      status: BOOKING_STATUS.PENDING,
      ...payload,
    }], {session});

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    const payment = await Payment.create([{
      booking: booking[0]._id,
      transactionID: getTransactionId(),
      amount: amount,
      status: PAYMENT_STATUS.UNPAID,
    }], {session});

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session}
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhone = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;


    const sslPayload:ISSLCommerz = {
      address: userAddress,
      name: userName,
      email: userEmail,
      phoneNumber: userPhone,
      transactionID: payment[0].transactionID,
      amount: payment[0].amount
    } 


    const sslPayment = await SSLService.sslPaymentInit(sslPayload) //it'll return a url

    await session.commitTransaction();

    return {
      paymentURL: sslPayment.GatewayPageURL,
      booking: updatedBooking
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }finally{
    session.endSession();
  }
};

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
