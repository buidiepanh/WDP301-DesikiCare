import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_Methods } from './cartItem.methods';
import { apply_Statics } from './cartItem.statics';
import { apply_Indexes } from './cartItem.indexes';
import { apply_Virtuals } from './cartItem.virtuals';
import { apply_PostHooks, apply_PreHooks } from './cartItem.hooks';

interface ICartItem_Statics {}

interface ICartItem_Methods {}

interface ICartItem_Virtuals {}

export type CartItemDocument = CartItem & Document & ICartItem_Methods & ICartItem_Virtuals;

@Schema({ collection: 'cartItems', timestamps: true })
export class CartItem {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;
}

type CartItemModel = Model<CartItemDocument> & ICartItem_Statics;
const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Apply hooks
apply_PreHooks(CartItemSchema);
apply_PostHooks(CartItemSchema);

// Apply methods
apply_Methods(CartItemSchema);

// Apply statics
apply_Statics(CartItemSchema);

// Apply virtuals
apply_Virtuals(CartItemSchema);

// Apply indexes
apply_Indexes(CartItemSchema);

export { CartItemSchema, CartItemModel };
