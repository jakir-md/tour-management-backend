import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVar } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

//ei controller gula kono response pathabe na.
//eder kaj hocche sslCommerz kortik redirect korar por ekahen esshe database a update kora
//tarpor frontend a user k redirect kore deya

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVar.SSL_SUCCESS_FRONTEND_URL}?transactionID=${query.transactionID}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVar.SSL_FAIL_FRONTEND_URL}?transactionID=${query.transactionID}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVar.SSL_CANCEL_FRONTEND_URL}?transactionID=${query.transactionID}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking updated successfully",
    data: result,
  });
});

export const PaymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
