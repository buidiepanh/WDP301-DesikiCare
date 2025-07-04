import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument, OrderModel } from "./order.schema";
import path from "path";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: OrderModel,
  ) { }

  async findById(id: any): Promise<OrderDocument | null> {
    return this.orderModel.findById(id)
      .populate('orderStatusId')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'shipmentProductId',
          model: 'ShipmentProduct',
          populate: {
            path: 'productId',
            model: 'Product',
          }
        }
      })
      .lean().exec();
  }

  async findAllByAccountId(accountId: Types.ObjectId): Promise<OrderDocument[]> {
    return this.orderModel.find({ accountId: accountId })
      .populate('orderStatusId')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'shipmentProductId',
          model: 'ShipmentProduct',
          populate: {
            path: 'productId',
            model: 'Product',
          }
        }
      })
      .lean()
      .exec();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find()
      .populate('orderStatusId')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'shipmentProductId',
          model: 'ShipmentProduct',
          populate: {
            path: 'productId',
            model: 'Product',
          }
        }
      })
      .lean()
      .exec();
  }

  async create(order: Order, session: ClientSession): Promise<Order> {
    // return this.orderModel.create(order);
    const created = new this.orderModel(order);
    await created.save({ session });
    return created;
  }

  async update(id: any, order: Order, session: ClientSession): Promise<Order | null> {
    // return this.orderModel.findByIdAndUpdate(id, order, { new: true }).exec();
    return await this.orderModel.findByIdAndUpdate(id, order, { new: true, session }).exec();
  }

  async delete(id: any): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
