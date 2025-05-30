import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderStatus, OrderStatusModel } from "./orderStatus.schema";

@Injectable()
export class OrderStatusRepository {
  constructor(
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: OrderStatusModel,
  ) {}

  async findById(id: any): Promise<OrderStatus | null> {
    return this.orderStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<OrderStatus[]> {
    return this.orderStatusModel.find().exec();
  }

  async create(orderStatus: OrderStatus): Promise<OrderStatus> {
    return this.orderStatusModel.create(orderStatus);
  }

  async update(id: any, orderStatus: OrderStatus): Promise<OrderStatus | null> {
    return this.orderStatusModel.findByIdAndUpdate(id, orderStatus, { new: true }).exec();
  }

  async delete(id: any): Promise<OrderStatus | null> {
    return this.orderStatusModel.findByIdAndDelete(id).exec();
  }
}
