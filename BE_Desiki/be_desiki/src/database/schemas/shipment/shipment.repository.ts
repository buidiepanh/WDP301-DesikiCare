import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, ShipmentDocument, ShipmentModel } from './shipment.schema';
import { ClientSession } from 'mongoose';

@Injectable()
export class ShipmentRepository {
  constructor(
    @InjectModel(Shipment.name) private readonly shipmentModel: ShipmentModel,
  ) { }

  async findById(id: any): Promise<ShipmentDocument | null> {
    return this.shipmentModel.findById(id)
      .populate({
        path: 'shipmentProducts',
        populate: {
          path: 'productId',
          model: 'Product',
        }
      })
      .lean().exec();
  }

  async findAll(): Promise<ShipmentDocument[]> {
    return this.shipmentModel.find()
      .populate({
        path: 'shipmentProducts',
        populate: {
          path: 'productId',
          model: 'Product',
        }
      })
      .lean()
      .exec();
  }

  async create(shipment: Shipment, session: ClientSession): Promise<Shipment> {
    const created = new this.shipmentModel(shipment);
    await created.save({ session });
    return created;
  }

  async update(id: any, shipment: Shipment, session: ClientSession): Promise<Shipment | null> {
    // return this.shipmentModel.findByIdAndUpdate(id, shipment, { new: true }).exec();
    return this.shipmentModel.findByIdAndUpdate(id, shipment, { new: true, session }).exec();
  }

  async delete(id: string, session: ClientSession ): Promise<Shipment | null> {
    return this.shipmentModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session }).exec();
  }
}
