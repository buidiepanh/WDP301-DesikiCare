import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PostHooks, apply_PreHooks } from './gameEvent.hooks';
import { apply_Methods } from './gameEvent.methods';
import { apply_Statics } from './gameEvent.statics';
import { apply_Virtuals } from './gameEvent.virtuals';
import { apply_Indexes } from './gameEvent.indexes';
import { GameType } from '../gameType/gameType.schema';
import { GameEventRewardResult } from '../gameEventRewardResult/gameEventRewardResult.schema';

interface IGameEvent_Statics { }
interface IGameEvent_Methods { }
interface IGameEvent_Virtuals {
  gameEventRewardResults: GameEventRewardResult[];
 }

export type GameEventDocument = GameEvent & Document & IGameEvent_Methods & IGameEvent_Virtuals;

@Schema({ collection: 'gameEvents', timestamps: true })
export class GameEvent {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  eventName: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  gameName: string;

  @Prop({ ref: GameType.name, required: true })
  gameTypeId: number;

  @Prop({ type: Object, required: true })
  configJson: any;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  balancePoints: number;

  @Prop({ required: true, default: true })
  isDeactivated?: boolean;
}

type GameEventModel = Model<GameEventDocument> & IGameEvent_Statics;
const GameEventSchema = SchemaFactory.createForClass(GameEvent);

apply_PreHooks(GameEventSchema);
apply_PostHooks(GameEventSchema);
apply_Methods(GameEventSchema);
apply_Statics(GameEventSchema);
apply_Virtuals(GameEventSchema);
apply_Indexes(GameEventSchema);

export { GameEventSchema, GameEventModel };
