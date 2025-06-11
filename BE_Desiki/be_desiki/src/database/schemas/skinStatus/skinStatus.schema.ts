import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './skinStatus.hooks';
import { apply_Methods } from './skinStatus.methods';
import { apply_Statics } from './skinStatus.statics';
import { apply_Virtuals } from './skinStatus.virtuals';
import { apply_Indexes } from './skinStatus.indexes';

interface ISkinStatus_Statics {}
interface ISkinStatus_Methods {}
interface ISkinStatus_Virtuals {}

export type SkinStatusDocument = SkinStatus & Document & ISkinStatus_Methods & ISkinStatus_Virtuals;

@Schema({ collection: 'skinStatuses', timestamps: true })
export class SkinStatus {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ required: true })
  name: string;
}

type SkinStatusModel = Model<SkinStatusDocument> & ISkinStatus_Statics;
const SkinStatusSchema = SchemaFactory.createForClass(SkinStatus);

apply_PreHooks(SkinStatusSchema);
apply_PostHooks(SkinStatusSchema);
apply_Methods(SkinStatusSchema);
apply_Statics(SkinStatusSchema);
apply_Virtuals(SkinStatusSchema);
apply_Indexes(SkinStatusSchema);

export { SkinStatusSchema, SkinStatusModel };
