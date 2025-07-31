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

  async findBySkinTypeIdsAndSkinStatusIds(
    skinTypeIds: number[],
    skinStatusIds: number[])
    : Promise<ProductDocument[]> {

    console.log("Finding products by skin types and statuses:", skinTypeIds, skinStatusIds);
  
    
    const productSkinTypes = await this.productModel.db.collection('productSkinTypes').find({
      skinTypeId: { $in: skinTypeIds }
    }).toArray();
    
    const productSkinStatuses = await this.productModel.db.collection('productSkinStatuses').find({
      skinStatusId: { $in: skinStatusIds }
    }).toArray();
    
    console.log("ProductSkinTypes found:", productSkinTypes.length);
    console.log("ProductSkinStatuses found:", productSkinStatuses.length);
    
    // Get productIds that exist in both arrays
    const skinTypeProductIds = [...new Set(productSkinTypes.map(pst => pst.productId.toString()))];
    const skinStatusProductIds = [...new Set(productSkinStatuses.map(pss => pss.productId.toString()))];
    
    // Find intersection - products that have both matching skin types and skin statuses
    const matchingProductIds = skinTypeProductIds.filter(id => 
      skinStatusProductIds.includes(id)
    ).map(id => new Types.ObjectId(id));
    
    console.log("Matching Product IDs:", matchingProductIds);
    
    // Query products with matching IDs
    const result = await this.productModel.find({
      _id: { $in: matchingProductIds }
    })
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

    console.log("Query result count:", result.length);
    return result;

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
