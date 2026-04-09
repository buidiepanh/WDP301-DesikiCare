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
import { Shipment, ShipmentSchema } from 'src/database/schemas/shipment/shipment.schema';
import { ShipmentProduct, ShipmentProductSchema } from 'src/database/schemas/shipmentProduct/shipmentProduct.schema';
import { ShipmentProductRepository } from 'src/database/schemas/shipmentProduct/shipmentProduct.repository';
import { ShipmentRepository } from 'src/database/schemas/shipment/shipment.repository';
import { ShipmentsService } from './services/shipments.service';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';
import { CartItem, CartItemSchema } from 'src/database/schemas/cartItem/cartItem.schema';
import { AccountModule } from '../account/Account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },                        // products
      { name: Category.name, schema: CategorySchema },                      // categories
      { name: ProductSkinType.name, schema: ProductSkinTypeSchema },        // productSkinTypes
      { name: ProductSkinStatus.name, schema: ProductSkinStatusSchema },    // productSkinStatuses
      { name: SkinType.name, schema: SkinTypeSchema },                      // skinTypes
      { name: SkinStatus.name, schema: SkinStatusSchema },                  // skinStatuses
      { name: Shipment.name, schema: ShipmentSchema },                      // shipments
      { name: ShipmentProduct.name, schema: ShipmentProductSchema },        // shipmentProducts
      { name: CartItem.name, schema: CartItemSchema },                      // cartItems
    ]),
    // BookingModule,
    // ServiceModule
    AccountModule
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
    ShipmentProductRepository,
    ShipmentRepository,
    CartItemRepository,


    // Inner Services
    ProductsService,
    SkinsService,
    ShipmentsService,

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
    ShipmentProductRepository,
    ShipmentRepository,

    // Inner Services
    ProductsService,
    SkinsService,
    ShipmentsService,
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
