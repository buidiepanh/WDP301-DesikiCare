import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSkinStatus, ProductSkinStatusModel } from "./productSkinStatus.schema";
import { ClientSession } from "mongoose";

@Injectable()
export class ProductSkinStatusRepository {
  constructor(
    @InjectModel(ProductSkinStatus.name) private readonly productSkinStatusModel: ProductSkinStatusModel,
  ) { }

  async findById(id: any): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<ProductSkinStatus[]> {
    return this.productSkinStatusModel.find().exec();
  }

  async create(productSkinStatus: ProductSkinStatus, session: ClientSession): Promise<ProductSkinStatus> {
    const created = new this.productSkinStatusModel(productSkinStatus);
    await created.save({ session });
    return created;
  }

  async update(id: any, productSkinStatus: ProductSkinStatus): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findByIdAndUpdate(id, productSkinStatus, { new: true }).exec();
  }

  async delete(id: any): Promise<ProductSkinStatus | null> {
    return this.productSkinStatusModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(condition: any, session: ClientSession): Promise<any> {
    return this.productSkinStatusModel.deleteMany(condition, { session }).exec();
  }
}
