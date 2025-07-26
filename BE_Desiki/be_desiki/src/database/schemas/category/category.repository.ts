import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryModel } from "./category.schema";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: CategoryModel,
  ) {}

  async findById(id: any): Promise<Category | null> {
    return this.categoryModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async create(category: Category): Promise<Category> {
    return this.categoryModel.create(category);
  }

  async update(id: any, category: Category): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, category, { new: true }).exec();
  }

  async delete(id: any): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
