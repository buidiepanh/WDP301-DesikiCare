import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './category.hooks';
import { apply_Methods } from './category.methods';
import { apply_Statics } from './category.statics';
import { apply_Virtuals } from './category.virtuals';
import { apply_Indexes } from './category.indexes';

interface ICategory_Statics {}
interface ICategory_Methods {}
interface ICategory_Virtuals {}

export type CategoryDocument = Category & Document & ICategory_Methods & ICategory_Virtuals;

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ required: true })
  name: string;
}

type CategoryModel = Model<CategoryDocument> & ICategory_Statics;
const CategorySchema = SchemaFactory.createForClass(Category);

apply_PreHooks(CategorySchema);
apply_PostHooks(CategorySchema);
apply_Methods(CategorySchema);
apply_Statics(CategorySchema);
apply_Virtuals(CategorySchema);
apply_Indexes(CategorySchema);

export { CategorySchema, CategoryModel };
