import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShipmentProduct, ShipmentProductModel } from './shipmentProduct.schema';
import { ClientSession, Types } from 'mongoose';

@Injectable()
export class ShipmentProductRepository {
  constructor(
    @InjectModel(ShipmentProduct.name) private readonly shipmentProductModel: ShipmentProductModel,
  ) { }

  async findByShipmentId(shipmentId: string): Promise<ShipmentProduct[]> {
    return this.shipmentProductModel.find({ shipmentId }).exec();
  }

  async findByProductId(productId: Types.ObjectId): Promise<ShipmentProduct[]> {
    return this.shipmentProductModel.find({ productId })
      .populate("shipmentId")
      .lean()
      .exec();
  }

  async findByShipmentIdAndProductId(shipmentId: string, productId: Types.ObjectId): Promise<ShipmentProduct | null> {
    return this.shipmentProductModel.findOne({ shipmentId, productId }).exec();
  }

  async findById(id: any): Promise<ShipmentProduct | null> {
    return this.shipmentProductModel.findById(id)
      .populate("productId")
      .populate("shipmentId")
      .lean().exec();
  }

  async findAll(): Promise<ShipmentProduct[]> {
    return this.shipmentProductModel.find().exec();
  }

  async create(shipmentProduct: ShipmentProduct, session: ClientSession): Promise<ShipmentProduct> {
    // return this.shipmentProductModel.create(shipmentProduct);
    const created = new this.shipmentProductModel(shipmentProduct);
    await created.save({ session });
    return created;
  }

  async update(id: any, shipmentProduct: ShipmentProduct, session: ClientSession): Promise<ShipmentProduct | null> {
    return this.shipmentProductModel.findByIdAndUpdate(id, shipmentProduct, { new: true, session }).exec();
  }

  async delete(id: any): Promise<ShipmentProduct | null> {
    return this.shipmentProductModel.findByIdAndDelete(id).exec();
  }

  async deactivate(id: Types.ObjectId, isDeactivated: boolean, session: ClientSession): Promise<ShipmentProduct | null> {
    return this.shipmentProductModel.findByIdAndUpdate(id, { isDeactivated }, { new: true, session }).exec();
  }

  async deleteMany(condition: any, session: ClientSession): Promise<any> {
    return this.shipmentProductModel.deleteMany(condition, { session }).exec();
  }
}
