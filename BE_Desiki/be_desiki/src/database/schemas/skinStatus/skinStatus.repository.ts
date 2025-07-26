import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SkinStatus, SkinStatusModel } from "./skinStatus.schema";

@Injectable()
export class SkinStatusRepository {
  constructor(
    @InjectModel(SkinStatus.name) private readonly skinStatusModel: SkinStatusModel,
  ) {}

  async findById(id: any): Promise<SkinStatus | null> {
    return this.skinStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<SkinStatus[]> {
    return this.skinStatusModel.find().exec();
  }

  async create(skinStatus: SkinStatus): Promise<SkinStatus> {
    return this.skinStatusModel.create(skinStatus);
  }

  async update(id: any, skinStatus: SkinStatus): Promise<SkinStatus | null> {
    return this.skinStatusModel.findByIdAndUpdate(id, skinStatus, { new: true }).exec();
  }

  async delete(id: any): Promise<SkinStatus | null> {
    return this.skinStatusModel.findByIdAndDelete(id).exec();
  }
}
