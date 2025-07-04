import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument, CartModel } from "./cart.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: CartModel,
  ) { }

  async findById(id: any): Promise<Cart | null> {
    return this.cartModel.findById(id).lean().exec();
  }

  async findActiveByAccountId(accountId: Types.ObjectId): Promise<CartDocument | null> {
    return this.cartModel.findOne({ accountId: accountId, isActive: true })
      .populate({
        path: 'cartItems',
        populate: {
          path: 'productId',
          model: 'Product',
        }
      })
      .lean().exec();
  }

  async findAllByAccountId(accountId: Types.ObjectId): Promise<Cart | null> {
    return this.cartModel.findOne({ accountId: accountId }).lean().exec();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async create(cart: Cart, session: ClientSession): Promise<Cart> {
    const created = new this.cartModel(cart);
    await created.save({ session });
    return created;
  }

  async update(id: any, cart: Cart): Promise<Cart | null> {
    return this.cartModel.findByIdAndUpdate(id, cart, { new: true }).exec();
  }

  async delete(id: any): Promise<Cart | null> {
    return this.cartModel.findByIdAndDelete(id).exec();
  }

  async active(id: Types.ObjectId , isActive: boolean, session: ClientSession): Promise<Cart | null> {
    return this.cartModel.findByIdAndUpdate(id, { isActive }, { new: true, session }).exec(); 
  }
}
