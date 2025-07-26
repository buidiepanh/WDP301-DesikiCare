import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './paymentStatus.hooks';
import { apply_Methods } from './paymentStatus.methods';
import { apply_Statics } from './paymentStatus.statics';
import { apply_Virtuals } from './paymentStatus.virtuals';
import { apply_Indexes } from './paymentStatus.indexes';

interface IPaymentStatus_Statics {}
interface IPaymentStatus_Methods {}
interface IPaymentStatus_Virtuals {}

export type PaymentStatusDocument = PaymentStatus & Document & IPaymentStatus_Methods & IPaymentStatus_Virtuals;

@Schema({ collection: 'paymentStatuses', timestamps: true })
export class PaymentStatus {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ required: true })
  name: string;
}

type PaymentStatusModel = Model<PaymentStatusDocument> & IPaymentStatus_Statics;
const PaymentStatusSchema = SchemaFactory.createForClass(PaymentStatus);

apply_PreHooks(PaymentStatusSchema);
apply_PostHooks(PaymentStatusSchema);
apply_Methods(PaymentStatusSchema);
apply_Statics(PaymentStatusSchema);
apply_Virtuals(PaymentStatusSchema);
apply_Indexes(PaymentStatusSchema);

export { PaymentStatusSchema, PaymentStatusModel };
