import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './order.hooks';
import { apply_Methods } from './order.methods';
import { apply_Statics } from './order.statics';
import { apply_Virtuals } from './order.virtuals';
import { apply_Indexes } from './order.indexes';

interface IOrder_Statics {}
interface IOrder_Methods {}
interface IOrder_Virtuals {}

export type OrderDocument = Order & Document & IOrder_Methods & IOrder_Virtuals;

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DeliveryAddress', required: true })
  deliveryAddressId: Types.ObjectId;

  @Prop({ required: true })
  pointUsed: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  finalPrice: number;
}

type OrderModel = Model<OrderDocument> & IOrder_Statics;
const OrderSchema = SchemaFactory.createForClass(Order);

apply_PreHooks(OrderSchema);
apply_PostHooks(OrderSchema);
apply_Methods(OrderSchema);
apply_Statics(OrderSchema);
apply_Virtuals(OrderSchema);
apply_Indexes(OrderSchema);

export { OrderSchema, OrderModel };
