import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductModel } from "./product.schema";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: ProductModel,
  ) {}

  async findById(id: any): Promise<Product | null> {
    return this.productModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async create(product: Product): Promise<Product> {
    return this.productModel.create(product);
  }

  async update(id: any, product: Product): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async delete(id: any): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
