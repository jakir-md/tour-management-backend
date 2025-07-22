import express from "express";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

// api/v1/payment/success
// after successfull payment sslcommerz will hit this url
//this url will update the db and then from there redirected to frontendpage url

router.post("/success", PaymentControllers.successPayment);


//if a user cancels a payment he doesn't get any option to pay for it again
//we are creating a route so that he gets an options for paying again for the last booking he created and cancelled payment

router.post("/init-payment/:bookingId", PaymentControllers.initPayment);


// api/v1/payment/failed
router.post("/fail", PaymentControllers.failPayment);

// api/v1/payment/cancelled
router.post("/cancel", PaymentControllers.cancelPayment);

export const PaymentRoutes = router;
