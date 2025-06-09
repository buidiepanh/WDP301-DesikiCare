import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameType, GameTypeModel } from "./gameType.schema";

@Injectable()
export class GameTypeRepository {
  constructor(
    @InjectModel(GameType.name) private readonly gameTypeModel: GameTypeModel,
  ) {}

  async findById(id: any): Promise<GameType | null> {
    return this.gameTypeModel.findById(id).lean().exec();
  }

  async findAll(): Promise<GameType[]> {
    return this.gameTypeModel.find().exec();
  }

  async create(gameType: GameType): Promise<GameType> {
    return this.gameTypeModel.create(gameType);
  }

  async update(id: any, gameType: GameType): Promise<GameType | null> {
    return this.gameTypeModel.findByIdAndUpdate(id, gameType, { new: true }).exec();
  }

  async delete(id: any): Promise<GameType | null> {
    return this.gameTypeModel.findByIdAndDelete(id).exec();
  }
}
