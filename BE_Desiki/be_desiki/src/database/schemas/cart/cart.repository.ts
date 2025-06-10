import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartModel } from "./cart.schema";

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: CartModel,
  ) {}

  async findById(id: any): Promise<Cart | null> {
    return this.cartModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async create(cart: Cart): Promise<Cart> {
    return this.cartModel.create(cart);
  }

  async update(id: any, cart: Cart): Promise<Cart | null> {
    return this.cartModel.findByIdAndUpdate(id, cart, { new: true }).exec();
  }

  async delete(id: any): Promise<Cart | null> {
    return this.cartModel.findByIdAndDelete(id).exec();
  }
}
