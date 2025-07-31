import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuizOption, QuizOptionModel } from "./quizOption.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class QuizOptionRepository {
  constructor(
    @InjectModel(QuizOption.name) private readonly quizOptionModel: QuizOptionModel,
  ) {}

  async findById(id: any): Promise<QuizOption | null> {
    return this.quizOptionModel.findById(id).lean().exec();
  }

  async findAll(): Promise<QuizOption[]> {
    return this.quizOptionModel.find().exec();
  }

  async create(quizOption: QuizOption, session?: ClientSession): Promise<QuizOption> {
    const created = new this.quizOptionModel(quizOption);
    if (session) {
      await created.save({ session });
    } else {
      await created.save();
    }
    return created;
  }

  async update(id: any, quizOption: QuizOption, session?: ClientSession): Promise<QuizOption | null> {
    const updateOptions = { new: true };
    if (session) {
      Object.assign(updateOptions, { session });
    }
    return this.quizOptionModel.findByIdAndUpdate(id, quizOption, updateOptions).exec();
  }

  async delete(id: any): Promise<QuizOption | null> {
    return this.quizOptionModel.findByIdAndDelete(id).exec();
  }

  async findByQuizQuestionId(quizQuestionId: Types.ObjectId): Promise<QuizOption[]> {
    return this.quizOptionModel.find({ quizQuestionId }).exec();
  }

  async findByContent(content: string): Promise<QuizOption[]> {
    return this.quizOptionModel.find({ content: { $regex: content, $options: 'i' } }).exec();
  }
}
