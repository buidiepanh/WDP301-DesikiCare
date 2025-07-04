import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameEventRewardResult, GameEventRewardResultModel } from "./gameEventRewardResult.schema";
import { ClientSession } from "mongoose";

@Injectable()
export class GameEventRewardResultRepository {
  constructor(
    @InjectModel(GameEventRewardResult.name) private readonly gameEventRewardResultModel: GameEventRewardResultModel,
  ) { }

  async findById(id: any): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findById(id).lean().exec();
  }

  async findByAccountId(accountId: any): Promise<GameEventRewardResult[]> {
    return this.gameEventRewardResultModel.find({ accountId: accountId })
      .populate("gameEventId")
      .lean()
      .exec();
  }

  async findByGameEventId(gameEventId: any): Promise<GameEventRewardResult[] | null> {
    return this.gameEventRewardResultModel.find({ gameEventId: gameEventId })
      .populate("gameEventId")
      .lean()
      .exec();
  }

  async findAll(): Promise<GameEventRewardResult[]> {
    return this.gameEventRewardResultModel.find().exec();
  }

  async create(gameEventRewardResult: GameEventRewardResult, session : ClientSession): Promise<GameEventRewardResult> {
    const created = new this.gameEventRewardResultModel(gameEventRewardResult);
    await created.save({ session });
    return created;
  }

  async update(id: any, gameEventRewardResult: GameEventRewardResult): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findByIdAndUpdate(id, gameEventRewardResult, { new: true }).exec();
  }

  async delete(id: any): Promise<GameEventRewardResult | null> {
    return this.gameEventRewardResultModel.findByIdAndDelete(id).exec();
  }
}
