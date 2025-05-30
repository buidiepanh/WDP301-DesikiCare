import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameEvent, GameEventModel } from "./gameEvent.schema";

@Injectable()
export class GameEventRepository {
  constructor(
    @InjectModel(GameEvent.name) private readonly gameEventModel: GameEventModel,
  ) {}

  async findById(id: any): Promise<GameEvent | null> {
    return this.gameEventModel.findById(id).lean().exec();
  }

  async findAll(): Promise<GameEvent[]> {
    return this.gameEventModel.find().exec();
  }

  async create(gameEvent: GameEvent): Promise<GameEvent> {
    return this.gameEventModel.create(gameEvent);
  }

  async update(id: any, gameEvent: GameEvent): Promise<GameEvent | null> {
    return this.gameEventModel.findByIdAndUpdate(id, gameEvent, { new: true }).exec();
  }

  async delete(id: any): Promise<GameEvent | null> {
    return this.gameEventModel.findByIdAndDelete(id).exec();
  }
}
