import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './payment.hooks';
import { apply_Methods } from './payment.methods';
import { apply_Statics } from './payment.statics';
import { apply_Virtuals } from './payment.virtuals';
import { apply_Indexes } from './payment.indexes';

interface IPayment_Statics {}
interface IPayment_Methods {}
interface IPayment_Virtuals {}

export type PaymentDocument = Payment & Document & IPayment_Methods & IPayment_Virtuals;

@Schema({ collection: 'payments', timestamps: true })
export class Payment {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
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
