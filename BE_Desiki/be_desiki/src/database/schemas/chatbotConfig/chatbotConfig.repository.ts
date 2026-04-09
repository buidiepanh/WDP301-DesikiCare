import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChatbotConfig, ChatbotConfigDocument, ChatbotConfigModel } from './chatbotConfig.schema';

@Injectable()
export class ChatbotConfigRepository {
  constructor(
    @InjectModel(ChatbotConfig.name) private readonly chatbotConfigModel: ChatbotConfigModel,
  ) {}

  async findById(id: any): Promise<ChatbotConfig | null> {
    return this.chatbotConfigModel.findById(id).lean().exec();
  }

  async findAll(): Promise<ChatbotConfig[]> {
    return this.chatbotConfigModel.find().exec();
  }

  async create(chatbotConfig: ChatbotConfig, session: ClientSession): Promise<ChatbotConfig> {
    // return this.chatbotConfigModel.create(chatbotConfig);
    const created = new this.chatbotConfigModel(chatbotConfig);
    await created.save({ session });
    return created;
  }

  async update(id: any, chatbotConfig: ChatbotConfig, session: ClientSession): Promise<ChatbotConfig | null> {
    // return this.chatbotConfigModel.findByIdAndUpdate(id, chatbotConfig, { new: true }).exec();
    return this.chatbotConfigModel.findByIdAndUpdate(id, chatbotConfig, { new: true, session }).exec();
  }

  async delete(id: any): Promise<ChatbotConfig | null> {
    return this.chatbotConfigModel.findByIdAndDelete(id).exec();
  }

  async deactivate(id: any, isDeactivated: boolean, session: ClientSession): Promise<ChatbotConfig | null> {
    return this.chatbotConfigModel.findByIdAndUpdate(id, { isDeactivated }, { new: true, session }).exec();
  }
}
