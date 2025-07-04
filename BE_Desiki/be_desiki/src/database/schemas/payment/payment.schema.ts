import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './payment.hooks';
import { apply_Methods } from './payment.methods';
import { apply_Statics } from './payment.statics';
import { apply_Virtuals } from './payment.virtuals';
import { apply_Indexes } from './payment.indexes';
import { Account } from '../account/account.schema';
import { Order } from '../order/order.schema';
import { PaymentStatus } from '../paymentStatus/paymentStatus.schema';

interface IPayment_Statics {}
interface IPayment_Methods {}
interface IPayment_Virtuals {}

export type PaymentDocument = Payment & Document & IPayment_Methods & IPayment_Virtuals;

@Schema({ collection: 'payments', timestamps: true })
export class Payment {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ ref: PaymentStatus.name, required: true })
  paymentStatusId: number;
}

type PaymentModel = Model<PaymentDocument> & IPayment_Statics;
const PaymentSchema = SchemaFactory.createForClass(Payment);

apply_PreHooks(PaymentSchema);
apply_PostHooks(PaymentSchema);
apply_Methods(PaymentSchema);
apply_Statics(PaymentSchema);
apply_Virtuals(PaymentSchema);
apply_Indexes(PaymentSchema);

export { PaymentSchema, PaymentModel };
