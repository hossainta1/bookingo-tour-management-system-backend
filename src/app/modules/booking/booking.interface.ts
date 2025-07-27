// User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid

import { Types } from "mongoose";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { IPayment } from "../payment/payment.interface";


export enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
}

export interface IBooking {
    user: Types.ObjectId | IUser,
    tour: Types.ObjectId | ITour,
    payment?: Types.ObjectId | IPayment,
    guestCount: number,
    status: BOOKING_STATUS,
    createdAt?: Date
}