import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentStatus, PaymentStatusModel } from "./paymentStatus.schema";

@Injectable()
export class PaymentStatusRepository {
  constructor(
    @InjectModel(PaymentStatus.name) private readonly paymentStatusModel: PaymentStatusModel,
  ) {}

  async findById(id: any): Promise<PaymentStatus | null> {
    return this.paymentStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<PaymentStatus[]> {
    return this.paymentStatusModel.find().exec();
  }

  async create(paymentStatus: PaymentStatus): Promise<PaymentStatus> {
    return this.paymentStatusModel.create(paymentStatus);
  }

  async update(id: any, paymentStatus: PaymentStatus): Promise<PaymentStatus | null> {
    return this.paymentStatusModel.findByIdAndUpdate(id, paymentStatus, { new: true }).exec();
  }

  async delete(id: any): Promise<PaymentStatus | null> {
    return this.paymentStatusModel.findByIdAndDelete(id).exec();
  }
}
