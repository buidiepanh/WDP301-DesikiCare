import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument, ProductModel } from "./product.schema";
import { ClientSession, Types } from "mongoose";
import path from "path";
import { Category } from "../category/category.schema";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: ProductModel,
  ) { }


  async findById(id: Types.ObjectId): Promise<ProductDocument | null> {
    return this.productModel.findById(id)
      .populate('category')
      .populate('productSkinTypes')
      .populate('productSkinStatuses')
      .populate({
        path: 'shipmentProducts',
        populate: {
          path: 'shipmentId', 
          model: 'Shipment',  

        }
      })
      .populate({
        path: 'productSkinTypes',
        populate: {
          path: 'skinTypeId',
          model: 'SkinType',
        }
      })
      .populate({
        path: 'productSkinStatuses',
        populate: {
          path: 'skinStatusId',
          model: 'SkinStatus',
        }
      })
      .lean().exec();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find()
      .populate('category')
      .populate('productSkinTypes')
      .populate('productSkinStatuses')
      .populate({
        path: 'shipmentProducts',
        populate: {
          path: 'shipmentId',
          model: 'Shipment',

        }
      })
      .populate({
        path: 'productSkinTypes',
        populate: {
          path: 'skinTypeId',
          model: 'SkinType',
        }
      })
      .populate({
        path: 'productSkinStatuses',
        populate: {
          path: 'skinStatusId',
          model: 'SkinStatus',
        }
      })
      .lean()
      .exec();
  }

  async create(product: Product, session: ClientSession): Promise<Product> {
    const created = new this.productModel(product);
    await created.save({ session });
    return created;
  }

  async update(id: any, product: Product, session: ClientSession): Promise<Product | null> {
    // return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
    return await this.productModel.findByIdAndUpdate(id, product, { new: true, session }).exec();
  }

  async delete(id: any): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async deactivate(id: Types.ObjectId, isDeactivated: boolean, session: ClientSession): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(id, { isDeactivated }, { new: true, session }).exec();
  }
}
