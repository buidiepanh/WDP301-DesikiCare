import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SkinType, SkinTypeModel } from "./skinType.schema";

@Injectable()
export class SkinTypeRepository {
  constructor(
    @InjectModel(SkinType.name) private readonly skinTypeModel: SkinTypeModel,
  ) {}

  async findById(id: any): Promise<SkinType | null> {
    return this.skinTypeModel.findById(id).lean().exec();
  }

  async findAll(): Promise<SkinType[]> {
    return this.skinTypeModel.find().exec();
  }

  async create(skinType: SkinType): Promise<SkinType> {
    return this.skinTypeModel.create(skinType);
  }

  async update(id: any, skinType: SkinType): Promise<SkinType | null> {
    return this.skinTypeModel.findByIdAndUpdate(id, skinType, { new: true }).exec();
  }

  async delete(id: any): Promise<SkinType | null> {
    return this.skinTypeModel.findByIdAndDelete(id).exec();
  }
}
