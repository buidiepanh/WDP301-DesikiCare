import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QuizQuestion, QuizQuestionModel } from "./quizQuestion.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class QuizQuestionRepository {
  constructor(
    @InjectModel(QuizQuestion.name) private readonly quizQuestionModel: QuizQuestionModel,
  ) {}

  async findById(id: any): Promise<QuizQuestion | null> {
    return this.quizQuestionModel.findById(id).lean().exec();
  }

  async findAll(): Promise<QuizQuestion[]> {
    return this.quizQuestionModel.find().exec();
  }

  async create(quizQuestion: QuizQuestion, session?: ClientSession): Promise<QuizQuestion> {
    const created = new this.quizQuestionModel(quizQuestion);
    if (session) {
      await created.save({ session });
    } else {
      await created.save();
    }
    return created;
  }

  async update(id: any, quizQuestion: QuizQuestion, session?: ClientSession): Promise<QuizQuestion | null> {
    const updateOptions = { new: true };
    if (session) {
      Object.assign(updateOptions, { session });
    }
    return this.quizQuestionModel.findByIdAndUpdate(id, quizQuestion, updateOptions).exec();
  }

  async delete(id: any): Promise<QuizQuestion | null> {
    return this.quizQuestionModel.findByIdAndDelete(id).exec();
  }

  async findByContent(content: string): Promise<QuizQuestion[]> {
    return this.quizQuestionModel.find({ content: { $regex: content, $options: 'i' } }).exec();
  }
}
