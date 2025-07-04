import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatbotService } from './services/chatbot.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { Types } from 'mongoose';

@Controller('Chatbot')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class ChatbotController {

  constructor(
    private readonly chatbotService: ChatbotService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Lấy danh sách cấu hình chatbot
  @Get('chatbotConfigs')
  async getChatbotConfigs(
    @Req() req
  ) {
    var chatbotConfigs = await this.chatbotService.getChatbotConfigs();
    if (!req.user || (req.user && req.user.role._id === 3)) {
      // Filter out deactivated chatbot configs for public users
      chatbotConfigs = chatbotConfigs.filter(config => config.isDeactivated === false);
    }
    return {
      chatbotConfigs: chatbotConfigs,
    };
  }

  // Thêm cấu hình chatbot
  @Post('chatbotConfigs')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async createChatbotConfig(
    @Req() req,
    @Body() body: {
      chatbotConfig: {
        template: string;
        initPrompt: string;
      }
    }
  ) {
    const user = req.user;
    const newConfig = await this.chatbotService.createChatbotConfig(user._id, body.chatbotConfig);
    return {
      message: 'Chatbot config created successfully'
    };
  }

  // Cập nhật cấu hình chatbot
  @Put('chatbotConfigs/:chatbotConfigId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async updateChatbotConfig(
    @Req() req,
    @Param('chatbotConfigId') chatbotConfigId: Types.ObjectId,
    @Body() body: {
      chatbotConfig: {
        template: string;
        initPrompt: string;
      }
    }
  ) {
    const user = req.user;
    const updatedConfig = await this.chatbotService.updateChatbotConfig(chatbotConfigId, body.chatbotConfig);
    return {
      message: 'Chatbot config updated successfully'
    };
  }

  // Vô hiệu hóa hoặc kích hoạt chat bot
  @Put('chatbotConfigs/:chatbotConfigId/deactivate/:isDeactivate')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deactivateChatbotConfig(
    @Req() req,
    @Param('chatbotConfigId') chatbotConfigId: Types.ObjectId,
    @Param('isDeactivate') isDeactivate: string
  ) {
    const isDeactivateBool = isDeactivate === 'true';
    if (isDeactivate !== 'true' && isDeactivate !== 'false') {
      throw new BadRequestException('Invalid value for isDeactivate parameter');
    }
    const updatedConfig = await this.chatbotService.deactivateChatbotConfig(chatbotConfigId, isDeactivateBool);
    return {
      message: `Chatbot config ${isDeactivateBool == false ? 'activated' : 'deactivated'} successfully`
    };
  }


}
