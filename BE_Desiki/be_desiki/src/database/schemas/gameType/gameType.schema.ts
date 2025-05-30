import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './gameType.hooks';
import { apply_Methods } from './gameType.methods';
import { apply_Statics } from './gameType.statics';
import { apply_Virtuals } from './gameType.virtuals';
import { apply_Indexes } from './gameType.indexes';

interface IGameType_Statics {}
interface IGameType_Methods {}
interface IGameType_Virtuals {}

export type GameTypeDocument = GameType & Document & IGameType_Methods & IGameType_Virtuals;

@Schema({ collection: 'gameTypes', timestamps: true })
export class GameType {
  @Prop({ type: Number, required: true })
  _id?: number;

  @Prop({ required: true })
  name: string;
}

type GameTypeModel = Model<GameTypeDocument> & IGameType_Statics;
const GameTypeSchema = SchemaFactory.createForClass(GameType);

apply_PreHooks(GameTypeSchema);
apply_PostHooks(GameTypeSchema);
apply_Methods(GameTypeSchema);
apply_Statics(GameTypeSchema);
apply_Virtuals(GameTypeSchema);
apply_Indexes(GameTypeSchema);

export { GameTypeSchema, GameTypeModel };
