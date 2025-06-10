import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderItem, OrderItemModel } from "./orderItem.schema";

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(OrderItem.name) private readonly orderItemModel: OrderItemModel,
  ) {}

  async findById(id: any): Promise<OrderItem | null> {
    return this.orderItemModel.findById(id).lean().exec();
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemModel.find().exec();
  }

  async create(orderItem: OrderItem): Promise<OrderItem> {
    return this.orderItemModel.create(orderItem);
  }

  async update(id: any, orderItem: OrderItem): Promise<OrderItem | null> {
    return this.orderItemModel.findByIdAndUpdate(id, orderItem, { new: true }).exec();
  }

  async delete(id: any): Promise<OrderItem | null> {
    return this.orderItemModel.findByIdAndDelete(id).exec();
  }
}
