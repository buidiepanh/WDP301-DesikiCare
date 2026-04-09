import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Double, Model, Types } from 'mongoose';
;
import { apply_Indexes } from './product.indexes';
import { apply_PostHooks, apply_PreHooks } from './product.hooks';
import { apply_Methods } from './product.methods';
import { apply_Statics } from './product.statics';
import { apply_Virtuals } from './product.virtuals';
import { Category } from '../category/category.schema';
import { ProductSkinType } from '../productSkinType/productSkinType.schema';
import { ProductSkinStatus } from '../productSkinStatus/productSkinStatus.schema';
import { ShipmentProduct } from '../shipmentProduct/shipmentProduct.schema';
import { Shipment } from '../shipment/shipment.schema';

interface IProduct_Statics { }

interface IProduct_Methods { }

interface IProduct_Virtuals {
  productSkinTypes: ProductSkinType[];
  productSkinStatuses: ProductSkinStatus[];
  shipmentProducts: (ShipmentProduct)[];
  category: Category;
}

export type ProductDocument = Product & Document & IProduct_Methods & IProduct_Virtuals;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  _id?: Types.ObjectId;

  @Prop({ ref: Category.name })
  categoryId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;


  @Prop({ required: true })
  salePrice: number;

  @Prop({ required: true, default: 0 })
  gameTicketReward: number;

  @Prop()
  volume: number;

  @Prop({ required: true, default: true })
  isDeactivated?: boolean;
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
