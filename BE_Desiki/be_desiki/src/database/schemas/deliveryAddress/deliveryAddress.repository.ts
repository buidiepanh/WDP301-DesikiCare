import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DeliveryAddress, DeliveryAddressModel } from "./deliveryAddress.schema";
import { AnyARecord } from "dns";
import { Types } from "mongoose";

@Injectable()
export class DeliveryAddressRepository {
  constructor(
    @InjectModel(DeliveryAddress.name) private readonly deliveryAddressModel: DeliveryAddressModel,
  ) {}

  async setDefaultDeliveryAddress(accountId: Types.ObjectId, deliveryAddressId: Types.ObjectId): Promise<any> {
    await this.deliveryAddressModel.updateMany(
      { accountId: accountId, isDefault: true },
      { $set: { isDefault: false } }
    );
    return this.deliveryAddressModel.findByIdAndUpdate(
      deliveryAddressId,
      { $set: { isDefault: true } },
      { new: true }
    ).exec();
  }

  async findById(id: any): Promise<DeliveryAddress | null> {
    return this.deliveryAddressModel.findById(id).lean().exec();
  }

  async findByAccountId(accountId: any): Promise<DeliveryAddress[]> {
    return this.deliveryAddressModel.find({ accountId: accountId }).exec();
  }

  async findAll(): Promise<DeliveryAddress[]> {
    return this.deliveryAddressModel.find().exec();
  }

  async create(deliveryAddress: DeliveryAddress): Promise<DeliveryAddress> {
    return this.deliveryAddressModel.create(deliveryAddress);
  }

  async update(id: any, deliveryAddress: DeliveryAddress): Promise<DeliveryAddress | null> {
    return this.deliveryAddressModel.findByIdAndUpdate(id, deliveryAddress, { new: true }).exec();
  }

  async updateMany( condition: any, update: any): Promise<any> {
    return this.deliveryAddressModel.updateMany(condition, update).exec();
  }

  async delete(id: any): Promise<DeliveryAddress | null> {
    return this.deliveryAddressModel.findByIdAndDelete(id).exec();
  }
}
