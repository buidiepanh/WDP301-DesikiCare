import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuizOptionSkinType, QuizOptionSkinTypeDocument, QuizOptionSkinTypeModel } from "./quizOptionSkinType.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class QuizOptionSkinTypeRepository {
  constructor(
    @InjectModel(QuizOptionSkinType.name) private readonly quizOptionSkinTypeModel: QuizOptionSkinTypeModel,
  ) {}

  async findById(id: any): Promise<QuizOptionSkinType | null> {
    return this.quizOptionSkinTypeModel.findById(id).lean().exec();
  }

  async findAll(): Promise<QuizOptionSkinType[]> {
    return this.quizOptionSkinTypeModel.find().exec();
  }

  async create(quizOptionSkinType: QuizOptionSkinType, session?: ClientSession): Promise<QuizOptionSkinType> {
    const created = new this.quizOptionSkinTypeModel(quizOptionSkinType);
    if (session) {
      await created.save({ session });
    } else {
      await created.save();
    }
    return created;
  }

  async update(id: any, quizOptionSkinType: QuizOptionSkinType, session?: ClientSession): Promise<QuizOptionSkinType | null> {
    const updateOptions = { new: true };
    if (session) {
      Object.assign(updateOptions, { session });
    }
    return this.quizOptionSkinTypeModel.findByIdAndUpdate(id, quizOptionSkinType, updateOptions).exec();
  }

  async delete(id: any): Promise<QuizOptionSkinType | null> {
    return this.quizOptionSkinTypeModel.findByIdAndDelete(id).exec();
  }

  async findByQuizOptionId(quizOptionId: Types.ObjectId): Promise<QuizOptionSkinTypeDocument[]> {

    return this.quizOptionSkinTypeModel.find({ quizOptionId })
    .populate('skinType')
    .lean()
    .exec();
  }

  async findBySkinTypeId(skinTypeId: number): Promise<QuizOptionSkinType[]> {
    return this.quizOptionSkinTypeModel.find({ skinTypeId }).exec();
  }

  async findByQuizOptionAndSkinType(quizOptionId: Types.ObjectId, skinTypeId: number): Promise<QuizOptionSkinType | null> {
    return this.quizOptionSkinTypeModel.findOne({ quizOptionId, skinTypeId }).exec();
  }
}
