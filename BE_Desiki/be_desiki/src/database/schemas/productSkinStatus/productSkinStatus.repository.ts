import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSkinStatus, ProductSkinStatusModel } from "./productSkinStatus.schema";

@Injectable()
export class ProductSkinStatusRepository {
  constructor(
    @InjectModel(ProductSkinStatus.name) private readonly productSkinStatusModel: ProductSkinStatusModel,
  ) {}

  async findById(id: any): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<ProductSkinStatus[]> {
    return this.productSkinStatusModel.find().exec();
  }

  async create(productSkinStatus: ProductSkinStatus): Promise<ProductSkinStatus> {
    return this.productSkinStatusModel.create(productSkinStatus);
  }

  async update(id: any, productSkinStatus: ProductSkinStatus): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findByIdAndUpdate(id, productSkinStatus, { new: true }).exec();
  }

  async delete(id: any): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findByIdAndDelete(id).exec();
  }
}
