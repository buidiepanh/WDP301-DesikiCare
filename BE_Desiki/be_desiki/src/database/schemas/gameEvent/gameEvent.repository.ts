import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameEvent, GameEventDocument, GameEventModel } from "./gameEvent.schema";
import { ClientSession } from "mongoose";

@Injectable()
export class GameEventRepository {
  constructor(
    @InjectModel(GameEvent.name) private readonly gameEventModel: GameEventModel,
  ) { }

  async findById(id: any): Promise<GameEvent | null> {
    return this.gameEventModel.findById(id)
      .populate({
        path: 'gameEventRewardResults'
      })
      .lean().exec();
  }

  async findAll(): Promise<GameEventDocument[]> {
    return this.gameEventModel.find()
      .populate({
        path: 'gameEventRewardResults'
      })
      .lean()
      .exec();
  }

  async create(gameEvent: GameEvent, session: ClientSession): Promise<GameEvent> {
    const created = new this.gameEventModel(gameEvent);
    await created.save({ session });
    return created;
  }

  async update(id: any, gameEvent: GameEvent, session: ClientSession): Promise<GameEvent | null> {
    return this.gameEventModel.findByIdAndUpdate(id, gameEvent, { new: true }).exec();
  }

  async delete(id: any): Promise<GameEvent | null> {
    return this.gameEventModel.findByIdAndDelete(id).exec();
  }

  async deactivate(id: any, isDeactivated: boolean, session: ClientSession): Promise<GameEvent | null> {
    return this.gameEventModel.findByIdAndUpdate(id, { isDeactivated }, { new: true, session }).exec();
  }
}
