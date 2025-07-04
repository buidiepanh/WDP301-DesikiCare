import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment, PaymentModel } from "./payment.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: PaymentModel,
  ) {}

  async findById(id: any): Promise<Payment | null> {
    return this.paymentModel.findById(id).lean().exec();
  }

  async findByOrderId(orderId: Types.ObjectId): Promise<Payment | null> {
    return this.paymentModel.findOne({ orderId: orderId }).lean().exec();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async create(payment: Payment, session : ClientSession): Promise<Payment> {
    const created = new this.paymentModel(payment);
    await created.save({ session });
    return created;
  }

  async update(id: any, payment: Payment, session : ClientSession): Promise<Payment | null> {
    // return this.paymentModel.findByIdAndUpdate(id, payment, { new: true }).exec();
    return this.paymentModel.findByIdAndUpdate(id, payment, { new: true, session }).exec();
  }

  async delete(id: any): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
