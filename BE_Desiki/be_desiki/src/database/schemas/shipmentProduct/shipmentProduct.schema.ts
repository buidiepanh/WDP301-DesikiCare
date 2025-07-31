import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PreHooks, apply_PostHooks } from './shipmentProduct.hooks';
import { apply_Methods } from './shipmentProduct.methods';
import { apply_Statics } from './shipmentProduct.statics';
import { apply_Virtuals } from './shipmentProduct.virtuals';
import { apply_Indexes } from './shipmentProduct.indexes';
import { Product } from '../product/product.schema';
import { Shipment } from '../shipment/shipment.schema';

export type ShipmentProductDocument = ShipmentProduct & Document;

@Schema({ collection: 'shipmentProducts', timestamps: true })
export class ShipmentProduct {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ type: String, ref: Shipment.name, required: true })
  shipmentId: string;

  @Prop({ required: true, default: 0 })
  importQuantity: number;

  @Prop({ required: true, default: 0 })
  saleQuantity: number;

  @Prop()
  manufacturingDate: Date;

  @Prop()
  expiryDate: Date;

  @Prop()
  buyPrice: number;

  @Prop({ required: true, default: true })
  isDeactivated?: boolean;
}

type ShipmentProductModel = Model<ShipmentProductDocument>;
const ShipmentProductSchema = SchemaFactory.createForClass(ShipmentProduct);

apply_PreHooks(ShipmentProductSchema);
apply_PostHooks(ShipmentProductSchema);
apply_Methods(ShipmentProductSchema);
apply_Statics(ShipmentProductSchema);
apply_Virtuals(ShipmentProductSchema);
apply_Indexes(ShipmentProductSchema);

export { ShipmentProductSchema, ShipmentProductModel };
