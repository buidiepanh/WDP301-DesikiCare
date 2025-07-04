import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { apply_PreHooks, apply_PostHooks } from './chatbotConfig.hooks';
import { apply_Methods } from './chatbotConfig.methods';
import { apply_Statics } from './chatbotConfig.statics';
import { apply_Virtuals } from './chatbotConfig.virtuals';
import { apply_Indexes } from './chatbotConfig.indexes';
import { Account } from '../account/account.schema';

export type ChatbotConfigDocument = ChatbotConfig & Document;

@Schema({ collection: 'chatbotConfigs', timestamps: true })
export class ChatbotConfig {
  // @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop()
  template: string;

  @Prop()
  initPrompt: string;

  @Prop({ required: true, default: true })
  isDeactivated?: boolean;

  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  createdBy?: Types.ObjectId;
}

type ChatbotConfigModel = Model<ChatbotConfigDocument>;
const ChatbotConfigSchema = SchemaFactory.createForClass(ChatbotConfig);

apply_PreHooks(ChatbotConfigSchema);
apply_PostHooks(ChatbotConfigSchema);
apply_Methods(ChatbotConfigSchema);
apply_Statics(ChatbotConfigSchema);
apply_Virtuals(ChatbotConfigSchema);
apply_Indexes(ChatbotConfigSchema);

export { ChatbotConfigSchema, ChatbotConfigModel };
