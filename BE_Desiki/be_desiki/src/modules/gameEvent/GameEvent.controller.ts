import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameEventsService } from './services/gameEvents.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';

@Controller('gameEvents')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class GameEventController {

  constructor(
    private readonly gameEventsService: GameEventsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }


}
