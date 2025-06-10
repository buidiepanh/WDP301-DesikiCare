import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CartItem, CartItemModel } from "./cartItem.schema";

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectModel(CartItem.name) private readonly cartItemModel: CartItemModel,
  ) {}

  async findById(id: any): Promise<CartItem | null> {
    return this.cartItemModel.findById(id).lean().exec();
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemModel.find().exec();
  }

  async create(cartItem: CartItem): Promise<CartItem> {
    return this.cartItemModel.create(cartItem);
  }

  async update(id: any, cartItem: CartItem): Promise<CartItem | null> {
    return this.cartItemModel.findByIdAndUpdate(id, cartItem, { new: true }).exec();
  }

  async delete(id: any): Promise<CartItem | null> {
    return this.cartItemModel.findByIdAndDelete(id).exec();
  }
}
