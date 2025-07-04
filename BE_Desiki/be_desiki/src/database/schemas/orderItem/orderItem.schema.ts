import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './orderItem.hooks';
import { apply_Methods } from './orderItem.methods';
import { apply_Statics } from './orderItem.statics';
import { apply_Virtuals } from './orderItem.virtuals';
import { apply_Indexes } from './orderItem.indexes';
import { Order } from '../order/order.schema';
import { ShipmentProduct } from '../shipmentProduct/shipmentProduct.schema';

interface IOrderItem_Statics {}
interface IOrderItem_Methods {}
interface IOrderItem_Virtuals {}

export type OrderItemDocument = OrderItem & Document & IOrderItem_Methods & IOrderItem_Virtuals;

@Schema({ collection: 'orderItems', timestamps: true })
export class OrderItem {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ShipmentProduct.name, required: true })
  shipmentProductId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

type OrderItemModel = Model<OrderItemDocument> & IOrderItem_Statics;
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

apply_PreHooks(OrderItemSchema);
apply_PostHooks(OrderItemSchema);
apply_Methods(OrderItemSchema);
apply_Statics(OrderItemSchema);
apply_Virtuals(OrderItemSchema);
apply_Indexes(OrderItemSchema);

export { OrderItemSchema, OrderItemModel };
