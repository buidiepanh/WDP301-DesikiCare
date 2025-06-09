import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Payment, PaymentModel } from "./payment.schema";

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: PaymentModel,
  ) {}

  async findById(id: any): Promise<Payment | null> {
    return this.paymentModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async create(payment: Payment): Promise<Payment> {
    return this.paymentModel.create(payment);
  }

  async update(id: any, payment: Payment): Promise<Payment | null> {
    return this.paymentModel.findByIdAndUpdate(id, payment, { new: true }).exec();
  }

  async delete(id: any): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
