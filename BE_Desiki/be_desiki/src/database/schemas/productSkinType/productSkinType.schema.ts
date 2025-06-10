import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './productSkinType.hooks';
import { apply_Methods } from './productSkinType.methods';
import { apply_Statics } from './productSkinType.statics';
import { apply_Virtuals } from './productSkinType.virtuals';
import { apply_Indexes } from './productSkinType.indexes';


interface IProductSkinType_Statics {}

interface IProductSkinType_Methods {}

interface IProductSkinType_Virtuals {}

export type ProductSkinTypeDocument = ProductSkinType & Document & IProductSkinType_Methods & IProductSkinType_Virtuals;

@Schema({ collection: 'productSkinTypes', timestamps: true })
export class ProductSkinType {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  skinTypeId: number;
}

type ProductSkinTypeModel = Model<ProductSkinTypeDocument> & IProductSkinType_Statics;
const ProductSkinTypeSchema = SchemaFactory.createForClass(ProductSkinType);

// Apply hooks
apply_PreHooks(ProductSkinTypeSchema);
apply_PostHooks(ProductSkinTypeSchema);

// Apply methods
apply_Methods(ProductSkinTypeSchema);

// Apply statics
apply_Statics(ProductSkinTypeSchema);

// Apply virtuals
apply_Virtuals(ProductSkinTypeSchema);

// Apply indexes
apply_Indexes(ProductSkinTypeSchema);

export { ProductSkinTypeSchema, ProductSkinTypeModel };
