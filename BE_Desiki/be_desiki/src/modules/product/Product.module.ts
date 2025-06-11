import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './services/products.service';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { Product, ProductSchema } from 'src/database/schemas/product/product.schema';
import { Category, CategorySchema } from 'src/database/schemas/category/category.schema';
import { ProductSkinType, ProductSkinTypeSchema } from 'src/database/schemas/productSkinType/productSkinType.schema';
import { ProductSkinStatus, ProductSkinStatusSchema } from 'src/database/schemas/productSkinStatus/productSkinStatus.schema';
import { SkinType, SkinTypeSchema } from 'src/database/schemas/skinType/skinType.schema';
import { SkinStatus, SkinStatusSchema } from 'src/database/schemas/skinStatus/skinStatus.schema';
import { ProductRepository } from 'src/database/schemas/product/product.repository';
import { CategoryRepository } from 'src/database/schemas/category/category.repository';
import { ProductSkinTypeRepository } from 'src/database/schemas/productSkinType/productSkinType.repository';
import { ProductSkinStatusRepository } from 'src/database/schemas/productSkinStatus/productSkinStatus.repository';
import { SkinTypeRepository } from 'src/database/schemas/skinType/skinType.repository';
import { SkinStatusRepository } from 'src/database/schemas/skinStatus/skinStatus.repository';
import { SkinsService } from './services/skins.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },                        // products
      { name: Category.name, schema: CategorySchema },                       // categories
      { name: ProductSkinType.name, schema: ProductSkinTypeSchema },        // productSkinTypes
      { name: ProductSkinStatus.name, schema: ProductSkinStatusSchema },    // productSkinStatuses
      { name: SkinType.name, schema: SkinTypeSchema },                      // skinTypes
      { name: SkinStatus.name, schema: SkinStatusSchema },                  // skinStatuses
    ]),
    // BookingModule,
    // ServiceModule
  ],
  controllers: [ProductController],
  providers: [
    // Repositories
    ProductRepository,
    CategoryRepository,
    ProductSkinTypeRepository,
    ProductSkinStatusRepository,
    SkinTypeRepository,
    SkinStatusRepository,


    // Inner Services
    ProductsService,
    SkinsService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    ProductRepository,
    CategoryRepository,
    ProductSkinTypeRepository,
    ProductSkinStatusRepository,
    SkinTypeRepository,
    SkinStatusRepository,

    // Inner Services
    ProductsService,
    SkinsService,
  ]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
