import { envVar } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios, { HttpStatusCode } from "axios";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVar.SSL_STORE_ID,
      store_passwd: envVar.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionID,

      //if payments falls in the categories bellow then we want to hit into the backend url
      //in the bakend url we will do some task
      //after that we want to redirect into the frontend url

      success_url: `${envVar.SSL_SUCCESS_BACKEND_URL}?transactionID=${payload.transactionID}&amount=${payload.amount}&status=success`,
      fail_url: `${envVar.SSL_FAIL_BACKEND_URL}?transactionID=${payload.transactionID}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVar.SSL_CANCEL_BACKEND_URL}?transactionID=${payload.transactionID}&amount=${payload.amount}&status=cancel`,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: payload.address,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1342",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "017111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVar.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    console.log("From payment error: ", error);
    throw new AppError(HttpStatusCode.BadRequest, "Payment Error");
  }
};

export const SSLService = {
  sslPaymentInit,
};
