import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { SkinsService } from './services/skins.service';

@Controller('products')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class ProductController {

  constructor(
    private readonly productsService: ProductsService,
    private readonly skinsService: SkinsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  
}
