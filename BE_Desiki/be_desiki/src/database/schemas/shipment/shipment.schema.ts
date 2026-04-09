import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PreHooks, apply_PostHooks } from './shipment.hooks';
import { apply_Methods } from './shipment.methods';
import { apply_Statics } from './shipment.statics';
import { apply_Virtuals } from './shipment.virtuals';
import { apply_Indexes } from './shipment.indexes';
import { ShipmentProduct } from '../shipmentProduct/shipmentProduct.schema';


interface IShipment_Statics { }

interface IShipment_Methods { }

interface IShipment_Virtuals {
  shipmentProducts: (ShipmentProduct)[];
}

export type ShipmentDocument = Shipment & Document & IShipment_Methods & IShipment_Virtuals ;

@Schema({ collection: 'shipments', timestamps: true })
export class Shipment {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  shipmentDate: Date;

  @Prop({ required: true, default: false })
  isDeleted?: boolean;
}

type ShipmentModel = Model<ShipmentDocument> & IShipment_Statics;
const ShipmentSchema = SchemaFactory.createForClass(Shipment);

apply_PreHooks(ShipmentSchema);
apply_PostHooks(ShipmentSchema);
apply_Methods(ShipmentSchema);
apply_Statics(ShipmentSchema);
apply_Virtuals(ShipmentSchema);
apply_Indexes(ShipmentSchema);

export { ShipmentSchema, ShipmentModel };
