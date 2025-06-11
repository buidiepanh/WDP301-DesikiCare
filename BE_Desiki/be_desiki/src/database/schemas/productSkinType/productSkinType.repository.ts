import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSkinType, ProductSkinTypeModel } from "./productSkinType.schema";

@Injectable()
export class ProductSkinTypeRepository {
  constructor(
    @InjectModel(ProductSkinType.name) private readonly productSkinTypeModel: ProductSkinTypeModel,
  ) {}

  async findById(id: any): Promise<ProductSkinType | null> {
    return this.productSkinTypeModel.findById(id).lean().exec();
  }

  async findAll(): Promise<ProductSkinType[]> {
    return this.productSkinTypeModel.find().exec();
  }

  async create(productSkinType: ProductSkinType): Promise<ProductSkinType> {
    return this.productSkinTypeModel.create(productSkinType);
  }

  async update(id: any, productSkinType: ProductSkinType): Promise<ProductSkinType | null> {
    return this.productSkinTypeModel.findByIdAndUpdate(id, productSkinType, { new: true }).exec();
  }

  async delete(id: any): Promise<ProductSkinType | null> {
    return this.productSkinTypeModel.findByIdAndDelete(id).exec();
  }
}
