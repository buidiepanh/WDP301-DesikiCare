import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderPriceBaseGameTicketReward, OrderPriceBaseGameTicketRewardModel } from "./orderPriceBaseGameTicketReward.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class OrderPriceBaseGameTicketRewardRepository {
  constructor(
    @InjectModel(OrderPriceBaseGameTicketReward.name) private readonly orderPriceBaseGameTicketRewardModel: OrderPriceBaseGameTicketRewardModel,
  ) {}

  async findById(id: any): Promise<OrderPriceBaseGameTicketReward | null> {
    return this.orderPriceBaseGameTicketRewardModel.findById(id).lean().exec();
  }

  async findAll(): Promise<OrderPriceBaseGameTicketReward[]> {
    return this.orderPriceBaseGameTicketRewardModel.find().exec();
  }

  async create(orderPriceBaseGameTicketReward: OrderPriceBaseGameTicketReward, session?: ClientSession): Promise<OrderPriceBaseGameTicketReward> {
    const created = new this.orderPriceBaseGameTicketRewardModel(orderPriceBaseGameTicketReward);
    if (session) {
      await created.save({ session });
    } else {
      await created.save();
    }
    return created;
  }

  async update(id: any, orderPriceBaseGameTicketReward: OrderPriceBaseGameTicketReward, session?: ClientSession): Promise<OrderPriceBaseGameTicketReward | null> {
    const updateOptions = { new: true };
    if (session) {
      Object.assign(updateOptions, { session });
    }
    return this.orderPriceBaseGameTicketRewardModel.findByIdAndUpdate(id, orderPriceBaseGameTicketReward, updateOptions).exec();
  }

  async delete(id: any): Promise<OrderPriceBaseGameTicketReward | null> {
    return this.orderPriceBaseGameTicketRewardModel.findByIdAndDelete(id).exec();
  }

  async findByOrderPriceThreshold(orderPriceThreshold: number): Promise<OrderPriceBaseGameTicketReward[]> {
    return this.orderPriceBaseGameTicketRewardModel.find({ orderPriceThreshold: { $lte: orderPriceThreshold } }).sort({ orderPriceThreshold: -1 }).exec();
  }

  async getGameTicketRewardByPrice(price: number): Promise<number> {
    // Tìm document có orderPriceThreshold < price và gần nhất với price (sắp xếp giảm dần theo orderPriceThreshold)
    const result = await this.orderPriceBaseGameTicketRewardModel
      .findOne({ orderPriceThreshold: { $lt: price } })
      .sort({ orderPriceThreshold: -1 })
      .lean()
      .exec();
    
    // Trả về ticketCount nếu tìm thấy, ngược lại trả về 0
    return result ? result.gameTicketReward : 0;
  }

  async findByOrderPriceThresholdExact(orderPriceThreshold: number): Promise<OrderPriceBaseGameTicketReward | null> {
    return this.orderPriceBaseGameTicketRewardModel.findOne({ orderPriceThreshold }).lean().exec();
  }

  async findByOrderPriceThresholdExcluding(orderPriceThreshold: number, excludeId: any): Promise<OrderPriceBaseGameTicketReward | null> {
    return this.orderPriceBaseGameTicketRewardModel.findOne({ 
      orderPriceThreshold, 
      _id: { $ne: excludeId } 
    }).lean().exec();
  }

  
}
