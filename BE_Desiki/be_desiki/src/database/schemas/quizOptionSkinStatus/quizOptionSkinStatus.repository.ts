import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuizOptionSkinStatus, QuizOptionSkinStatusDocument, QuizOptionSkinStatusModel } from "./quizOptionSkinStatus.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class QuizOptionSkinStatusRepository {
  constructor(
    @InjectModel(QuizOptionSkinStatus.name) private readonly quizOptionSkinStatusModel: QuizOptionSkinStatusModel,
  ) {}

  async findById(id: any): Promise<QuizOptionSkinStatus | null> {
    return this.quizOptionSkinStatusModel.findById(id).lean().exec();
  }

  async findAll(): Promise<QuizOptionSkinStatus[]> {
    return this.quizOptionSkinStatusModel.find().exec();
  }

  async create(quizOptionSkinStatus: QuizOptionSkinStatus, session?: ClientSession): Promise<QuizOptionSkinStatus> {
    const created = new this.quizOptionSkinStatusModel(quizOptionSkinStatus);
    if (session) {
      await created.save({ session });
    } else {
      await created.save();
    }
    return created;
  }

  async update(id: any, quizOptionSkinStatus: QuizOptionSkinStatus, session?: ClientSession): Promise<QuizOptionSkinStatus | null> {
    const updateOptions = { new: true };
    if (session) {
      Object.assign(updateOptions, { session });
    }
    return this.quizOptionSkinStatusModel.findByIdAndUpdate(id, quizOptionSkinStatus, updateOptions).exec();
  }

  async delete(id: any): Promise<QuizOptionSkinStatus | null> {
    return this.quizOptionSkinStatusModel.findByIdAndDelete(id).exec();
  }

  async findByQuizOptionId(quizOptionId: Types.ObjectId): Promise<QuizOptionSkinStatusDocument[]> {
    return this.quizOptionSkinStatusModel.find({ quizOptionId })
    .populate('skinStatus')
    .lean()
    .exec();
  }

  async findBySkinStatusId(skinStatusId: number): Promise<QuizOptionSkinStatus[]> {
    return this.quizOptionSkinStatusModel.find({ skinStatusId }).exec();
  }

  async findByQuizOptionAndSkinStatus(quizOptionId: Types.ObjectId, skinStatusId: number): Promise<QuizOptionSkinStatus | null> {
    return this.quizOptionSkinStatusModel.findOne({ quizOptionId, skinStatusId }).exec();
  }
}
