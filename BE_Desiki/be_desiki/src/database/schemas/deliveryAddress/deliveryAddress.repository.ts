import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DeliveryAddress, DeliveryAddressModel } from "./deliveryAddress.schema";

@Injectable()
export class DeliveryAddressRepository {
  constructor(
    @InjectModel(DeliveryAddress.name) private readonly deliveryAddressModel: DeliveryAddressModel,
  ) {}

  async findById(id: any): Promise<DeliveryAddress | null> {
    return this.deliveryAddressModel.findById(id).lean().exec();
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

  async delete(id: any): Promise<DeliveryAddress | null> {
    return this.deliveryAddressModel.findByIdAndDelete(id).exec();
  }
}
