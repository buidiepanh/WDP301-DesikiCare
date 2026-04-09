import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './gameEventRewardResult.hooks';
import { apply_Methods } from './gameEventRewardResult.methods';
import { apply_Statics } from './gameEventRewardResult.statics';
import { apply_Virtuals } from './gameEventRewardResult.virtuals';
import { apply_Indexes } from './gameEventRewardResult.indexes';
import { GameEvent } from '../gameEvent/gameEvent.schema';
import { Account } from '../account/account.schema';

interface IGameEventRewardResult_Statics {}
interface IGameEventRewardResult_Methods {}
interface IGameEventRewardResult_Virtuals {}

export type GameEventRewardResultDocument = GameEventRewardResult & Document & IGameEventRewardResult_Methods & IGameEventRewardResult_Virtuals;

@Schema({ collection: 'gameEventRewardResults', timestamps: true })
export class GameEventRewardResult {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: GameEvent.name, required: true })
  gameEventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  points: number;
}

type GameEventRewardResultModel = Model<GameEventRewardResultDocument> & IGameEventRewardResult_Statics;
const GameEventRewardResultSchema = SchemaFactory.createForClass(GameEventRewardResult);

apply_PreHooks(GameEventRewardResultSchema);
apply_PostHooks(GameEventRewardResultSchema);
apply_Methods(GameEventRewardResultSchema);
apply_Statics(GameEventRewardResultSchema);
apply_Virtuals(GameEventRewardResultSchema);
apply_Indexes(GameEventRewardResultSchema);

export { GameEventRewardResultSchema, GameEventRewardResultModel };
