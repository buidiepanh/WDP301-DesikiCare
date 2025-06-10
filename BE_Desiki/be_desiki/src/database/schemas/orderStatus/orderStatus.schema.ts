import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './orderStatus.hooks';
import { apply_Methods } from './orderStatus.methods';
import { apply_Statics } from './orderStatus.statics';
import { apply_Virtuals } from './orderStatus.virtuals';
import { apply_Indexes } from './orderStatus.indexes';

interface IOrderStatus_Statics {}
interface IOrderStatus_Methods {}
interface IOrderStatus_Virtuals {}

export type OrderStatusDocument = OrderStatus & Document & IOrderStatus_Methods & IOrderStatus_Virtuals;

@Schema({ collection: 'orderStatuses', timestamps: true })
export class OrderStatus {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ required: true })
  name: string;
}

type OrderStatusModel = Model<OrderStatusDocument> & IOrderStatus_Statics;
const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

apply_PreHooks(OrderStatusSchema);
apply_PostHooks(OrderStatusSchema);
apply_Methods(OrderStatusSchema);
apply_Statics(OrderStatusSchema);
apply_Virtuals(OrderStatusSchema);
apply_Indexes(OrderStatusSchema);

export { OrderStatusSchema, OrderStatusModel };
