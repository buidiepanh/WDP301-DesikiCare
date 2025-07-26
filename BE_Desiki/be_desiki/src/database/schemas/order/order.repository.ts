import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderModel } from "./order.schema";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: OrderModel,
  ) {}

  async findById(id: any): Promise<Order | null> {
    return this.orderModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async create(order: Order): Promise<Order> {
    return this.orderModel.create(order);
  }

  async update(id: any, order: Order): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(id, order, { new: true }).exec();
  }

  async delete(id: any): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
