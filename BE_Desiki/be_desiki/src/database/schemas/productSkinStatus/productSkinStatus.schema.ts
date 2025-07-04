import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './productSkinStatus.hooks';
import { apply_Methods } from './productSkinStatus.methods';
import { apply_Statics } from './productSkinStatus.statics';
import { apply_Virtuals } from './productSkinStatus.virtuals';
import { apply_Indexes } from './productSkinStatus.indexes';
import { Product } from '../product/product.schema';
import { SkinStatus } from '../skinStatus/skinStatus.schema';

interface IProductSkinStatus_Statics { }

interface IProductSkinStatus_Methods { }

interface IProductSkinStatus_Virtuals { }

export type ProductSkinStatusDocument = ProductSkinStatus & Document & IProductSkinStatus_Methods & IProductSkinStatus_Virtuals;

@Schema({ collection: 'productSkinStatuses', timestamps: true })
export class ProductSkinStatus {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ ref: SkinStatus.name, required: true })
  skinStatusId: number;
}

type ProductSkinStatusModel = Model<ProductSkinStatusDocument> & IProductSkinStatus_Statics;
const ProductSkinStatusSchema = SchemaFactory.createForClass(ProductSkinStatus);

// Apply hooks
apply_PreHooks(ProductSkinStatusSchema);
apply_PostHooks(ProductSkinStatusSchema);

// Apply methods
apply_Methods(ProductSkinStatusSchema);

// Apply statics
apply_Statics(ProductSkinStatusSchema);

// Apply virtuals
apply_Virtuals(ProductSkinStatusSchema);

// Apply indexes
apply_Indexes(ProductSkinStatusSchema);

export { ProductSkinStatusSchema, ProductSkinStatusModel };
