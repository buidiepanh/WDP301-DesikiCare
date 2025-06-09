import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameEventRewardResult, GameEventRewardResultModel } from "./gameEventRewardResult.schema";

@Injectable()
export class GameEventRewardResultRepository {
  constructor(
    @InjectModel(GameEventRewardResult.name) private readonly gameEventRewardResultModel: GameEventRewardResultModel,
  ) {}

  async findById(id: any): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findById(id).lean().exec();
  }

  async findAll(): Promise<GameEventRewardResult[]> {
    return this.gameEventRewardResultModel.find().exec();
  }

  async create(gameEventRewardResult: GameEventRewardResult): Promise<GameEventRewardResult> {
    return this.gameEventRewardResultModel.create(gameEventRewardResult);
  }

  async update(id: any, gameEventRewardResult: GameEventRewardResult): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findByIdAndUpdate(id, gameEventRewardResult, { new: true }).exec();
  }

  async delete(id: any): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findByIdAndDelete(id).exec();
  }
}
