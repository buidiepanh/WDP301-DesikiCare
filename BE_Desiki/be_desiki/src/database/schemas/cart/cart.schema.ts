import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { IsBoolean } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './cart.hooks';
import { apply_Methods } from './cart.methods';
import { apply_Statics } from './cart.statics';
import { apply_Virtuals } from './cart.virtuals';
import { apply_Indexes } from './cart.indexes';
import { Account } from '../account/account.schema';
import { CartItem } from '../cartItem/cartItem.schema';

interface ICart_Statics { }

interface ICart_Methods { }

interface ICart_Virtuals {
  cartItems: CartItem[];
}

export type CartDocument = Cart & Document & ICart_Methods & ICart_Virtuals;

@Schema({ collection: 'carts', timestamps: true })
export class Cart {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  accountId: Types.ObjectId;

  @Prop({ default: true })
  @IsBoolean()
  isActive: boolean;
}

type CartModel = Model<CartDocument> & ICart_Statics;
const CartSchema = SchemaFactory.createForClass(Cart);

// Apply hooks
apply_PreHooks(CartSchema);
apply_PostHooks(CartSchema);

// Apply methods
apply_Methods(CartSchema);

// Apply statics
apply_Statics(CartSchema);

// Apply virtuals
apply_Virtuals(CartSchema);

// Apply indexes
apply_Indexes(CartSchema);

export { CartSchema, CartModel };
