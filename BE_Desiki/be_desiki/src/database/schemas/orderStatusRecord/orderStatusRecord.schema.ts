import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './orderStatusRecord.hooks';
import { apply_Methods } from './orderStatusRecord.methods';
import { apply_Statics } from './orderStatusRecord.statics';
import { apply_Virtuals } from './orderStatusRecord.virtuals';
import { apply_Indexes } from './orderStatusRecord.indexes';

interface IOrderStatusRecord_Statics {}
interface IOrderStatusRecord_Methods {}
interface IOrderStatusRecord_Virtuals {}

export type OrderStatusRecordDocument = OrderStatusRecord & Document & IOrderStatusRecord_Methods & IOrderStatusRecord_Virtuals;

@Schema({ collection: 'orderStatusRecords', timestamps: true })
export class OrderStatusRecord {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  orderStatusId: number;
}

type OrderStatusRecordModel = Model<OrderStatusRecordDocument> & IOrderStatusRecord_Statics;
const OrderStatusRecordSchema = SchemaFactory.createForClass(OrderStatusRecord);

apply_PreHooks(OrderStatusRecordSchema);
apply_PostHooks(OrderStatusRecordSchema);
apply_Methods(OrderStatusRecordSchema);
apply_Statics(OrderStatusRecordSchema);
apply_Virtuals(OrderStatusRecordSchema);
apply_Indexes(OrderStatusRecordSchema);

export { OrderStatusRecordSchema, OrderStatusRecordModel };
