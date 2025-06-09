import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './deliveryAddress.hooks';
import { apply_Methods } from './deliveryAddress.methods';
import { apply_Statics } from './deliveryAddress.statics';
import { apply_Virtuals } from './deliveryAddress.virtuals';
import { apply_Indexes } from './deliveryAddress.indexes';

interface IDeliveryAddress_Statics {}
interface IDeliveryAddress_Methods {}
interface IDeliveryAddress_Virtuals {}

export type DeliveryAddressDocument = DeliveryAddress & Document & IDeliveryAddress_Methods & IDeliveryAddress_Virtuals;

@Schema({ collection: 'deliveryAddresses', timestamps: true })
export class DeliveryAddress {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  provinceCode: string;

  @Prop({ required: true })
  districtCode: string;

  @Prop({ required: true })
  wardCode: string;

  @Prop({ required: true })
  addressDetailDescription: string;

  @Prop({ required: true })
  receiverName: string;

  @Prop({ required: true })
  receiverPhone: string;

  @Prop({ required: true, default: false })
  isDefault: boolean;
}

type DeliveryAddressModel = Model<DeliveryAddressDocument> & IDeliveryAddress_Statics;
const DeliveryAddressSchema = SchemaFactory.createForClass(DeliveryAddress);

apply_PreHooks(DeliveryAddressSchema);
apply_PostHooks(DeliveryAddressSchema);
apply_Methods(DeliveryAddressSchema);
apply_Statics(DeliveryAddressSchema);
apply_Virtuals(DeliveryAddressSchema);
apply_Indexes(DeliveryAddressSchema);

export { DeliveryAddressSchema, DeliveryAddressModel };
