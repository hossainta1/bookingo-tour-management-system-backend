/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from  "http-status-codes"

const initPayment = async (bookingId: string) => {

  const payment = await Payment.findOne({booking: bookingId});

  if(!payment){
    throw new AppError(httpStatus.NOT_FOUND, "Payment Not found. You have not Booked this tour")
  }
 
  const booking = await Booking.findById(payment.booking)

  const userAddress = (booking?.user as any).address;
      const userEmail = (booking?.user as any).email;
      const userPhoneNumber = (booking?.user as any).phone;
      const userName = (booking?.user as any).name;
  
      const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId,
      };
  
      const sslPayment = await SSLService.sslPaymentInit(sslPayload);
      
      return {
        paymentUrl: sslPayment.GatewayPageURL
      }
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedpayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedpayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, session }
    );

    await session.commitTransaction(); // trnsaction
    session.endSession();
    return { success: true, message: "Payment Complited Successfully" };
  } catch (error) {
    await session.abortTransaction(); // Roll Back
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedpayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedpayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction(); // trnsaction
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction(); // Roll Back
    session.endSession();
    throw error;
  }
};

const cancelPaytment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedpayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedpayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction(); // trnsaction
    session.endSession();
    return { success: false, message: "Payment Cancel" };
  } catch (error) {
    await session.abortTransaction(); // Roll Back
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPaytment,
};
