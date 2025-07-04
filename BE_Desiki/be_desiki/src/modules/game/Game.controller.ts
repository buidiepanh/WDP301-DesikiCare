import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameEventsService } from './services/gameEvents.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { Types } from 'mongoose';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';

@Controller('Game')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class GameController {

  constructor(
    private readonly gameEventsService: GameEventsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Lấy danh sách sự kiện game
  @Get('gameEvents')
  async getGameEvents(
    @Req() req
  ) {
    var gameEvents = await this.gameEventsService.getGameEvents();
    if (!req.user || (req.user && req.user.role._id === 3)) {
      // products = products.filter(product => product.product.isDeactivated === false);
      gameEvents = gameEvents.filter(event => event.gameEvent.isDeactivated === false && event.gameEventRewardResults.filter(reward => reward.accountId.toString() === req.user._id.toString()).length === 0);
    }
    return {
      gameEvents: gameEvents,
    };
  }

  // Thêm sự kiện game
  @Post('gameEvents')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async createGameEvent(
    @Body() body: {
      gameEvent: {
        eventName: string;
        description: string;
        gameName: string;
        gameTypeId: number;
        configJson: any;
        startDate: Date;
        endDate: Date;
        balancePoints: number;
        imageBase64: string;
      },
      gameTypeImageBase64s?: {
        id: number;
        imageBase64: string;
      }[];
    }
  ) {
    const gameEvent = await this.gameEventsService.createGameEvent(body);
    return {
      message: "Game event created successfully"
    };
  }

  // Lấy chi tiết sự kiện game
  @Get('gameEvents/:gameEventId')
  async getGameEventById(
    @Req() req,
    @Param('gameEventId') gameEventId: Types.ObjectId,
  ) {
    const gameEvent = await this.gameEventsService.getGameEventById(gameEventId);
    if (!req.user || (req.user && req.user.role._id === 3)) {
      if (gameEvent.gameEvent.isDeactivated === true) {
        throw new BadRequestException('Game event is deactivated');
      }
    }
    return gameEvent;
  }


  // Vô hiệu hóa hoặc kích hoạt sự kiện game
  @Put('gameEvents/:gameEventId/deactivate/:isDeactivate')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deactivateGameEvent(
    @Param('gameEventId') gameEventId: Types.ObjectId,
    @Param('isDeactivate') isDeactivate: string
  ) {
    const isDeactivateBool = isDeactivate === 'true';

    if (isDeactivate !== 'true' && isDeactivate !== 'false') {
      throw new BadRequestException('Invalid value for isDeactivate parameter');
    }
    const result = await this.gameEventsService.deactivateGameEvent(new Types.ObjectId(gameEventId), isDeactivateBool);
    return {
      message: `Game event ${isDeactivateBool == false ? 'activated' : 'deactivated'} successfully`,
    };
  }

  // Lấy danh sách loại game
  @Get('gameTypes')
  async getGameTypes() {
    const gameTypes = await this.gameEventsService.getGameTypes();
    return {
      gameTypes: gameTypes,
    };
  }

  // Lấy lịch sử nhận thưởng từ sự kiện game của tài khoản
  @Get('gameEventsRewards/me')
  @UseGuards(LoginJwtGuard)
  async getMyGameEventsRewards(
    @Req() req
  ) {
    const accountId = req.user._id;
    const gameEventRewardResults = await this.gameEventsService.getEventsRewardsByAccountId(accountId);
    return {
      gameEventRewardResults: gameEventRewardResults,
    };
  }

  // Thêm phần thưởng sự kiện game cho tài khoản
  @Post('gameEventsRewards')
  @Roles('customer')
  @UseGuards(RolesGuard)
  async addGameEventReward(
    @Req() req,
    @Body() body: {
      gameEventReward: {
        gameEventId: Types.ObjectId;
        points: number;
      }
    }
  ) {
    const accountId = req.user._id;
    const gameEventReward = await this.gameEventsService.addGameEventReward(accountId, body.gameEventReward);
    return {
      message: "Game event reward added successfully",
      gameEventReward: gameEventReward,
    };
  }

}
