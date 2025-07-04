import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CartItem, CartItemModel } from "./cartItem.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectModel(CartItem.name) private readonly cartItemModel: CartItemModel,
  ) { }

  async findById(id: any): Promise<CartItem | null> {
    return this.cartItemModel.findById(id).lean().exec();
  }

  async findByProductId(productId: Types.ObjectId): Promise<CartItem | null> {
    return this.cartItemModel.findOne({ productId }).lean().exec();
  }

  async findByCartIdAndProductId(cartId: Types.ObjectId, productId: Types.ObjectId): Promise<CartItem | null> {
    return this.cartItemModel.findOne({ cartId, productId }).lean().exec();
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemModel.find().exec();
  }

  async create(cartItem: CartItem, session: ClientSession): Promise<CartItem> {
    const created = new this.cartItemModel(cartItem);
    await created.save({ session });
    return created;
  }

  async update(id: any, cartItem: CartItem, session: ClientSession): Promise<CartItem | null> {
    return this.cartItemModel.findByIdAndUpdate(id, cartItem, { new: true, session }).exec();
  }

  async delete(id: any, session: ClientSession): Promise<CartItem | null> {
    return this.cartItemModel.findByIdAndDelete(id, { session }).exec();
  }

  async deleteMany(condition: any, session: ClientSession): Promise<any> {
    return this.cartItemModel.deleteMany(condition, { session }).exec();
  }
}
