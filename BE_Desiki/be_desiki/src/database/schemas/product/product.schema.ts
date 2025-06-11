import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
;
import { apply_Indexes } from './product.indexes';
import { apply_PostHooks, apply_PreHooks } from './product.hooks';
import { apply_Methods } from './product.methods';
import { apply_Statics } from './product.statics';
import { apply_Virtuals } from './product.virtuals';

interface IProduct_Statics {}

interface IProduct_Methods {}

interface IProduct_Virtuals {}

export type ProductDocument = Product & Document & IProduct_Methods & IProduct_Virtuals;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  categoryId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  buyPrice: number;

  @Prop({ required: true })
  salePrice: number;

  @Prop({ required: true })
  stockQuantity: number;

  @Prop({ required: true, default: false })
  isDeactivated: boolean;
}

type ProductModel = Model<ProductDocument> & IProduct_Statics;
const ProductSchema = SchemaFactory.createForClass(Product);

// Apply hooks
apply_PreHooks(ProductSchema);
apply_PostHooks(ProductSchema);

// Apply methods
apply_Methods(ProductSchema);

// Apply statics
apply_Statics(ProductSchema);

// Apply virtuals
apply_Virtuals(ProductSchema);

// Apply indexes
apply_Indexes(ProductSchema);

export { ProductSchema, ProductModel };
