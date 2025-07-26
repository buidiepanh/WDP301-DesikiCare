import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderStatusRecord, OrderStatusRecordModel } from "./orderStatusRecord.schema";

@Injectable()
export class OrderStatusRecordRepository {
  constructor(
    @InjectModel(OrderStatusRecord.name) private readonly orderStatusRecordModel: OrderStatusRecordModel,
  ) {}

  async findById(id: any): Promise<OrderStatusRecord | null> {
    return this.orderStatusRecordModel.findById(id).lean().exec();
  }

  async findAll(): Promise<OrderStatusRecord[]> {
    return this.orderStatusRecordModel.find().exec();
  }

  async create(orderStatusRecord: OrderStatusRecord): Promise<OrderStatusRecord> {
    return this.orderStatusRecordModel.create(orderStatusRecord);
  }

  async update(id: any, orderStatusRecord: OrderStatusRecord): Promise<OrderStatusRecord | null> {
    return this.orderStatusRecordModel.findByIdAndUpdate(id, orderStatusRecord, { new: true }).exec();
  }

  async delete(id: any): Promise<OrderStatusRecord | null> {
    return this.orderStatusRecordModel.findByIdAndDelete(id).exec();
  }
}
