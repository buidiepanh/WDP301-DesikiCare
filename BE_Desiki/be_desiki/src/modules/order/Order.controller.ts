import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { OrdersService } from './services/orders.service';
import { CartsService } from './services/carts.service';

@Controller('orders')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class OrderController {

  constructor(
    private readonly ordersService : OrdersService,
    private readonly cartsService : CartsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  
}
