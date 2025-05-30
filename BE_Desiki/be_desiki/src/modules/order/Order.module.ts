import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderController } from './Order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { Order, OrderSchema } from 'src/database/schemas/order/order.schema';
import { OrderStatusRecord, OrderStatusRecordSchema } from 'src/database/schemas/orderStatusRecord/orderStatusRecord.schema';
import { OrderStatus, OrderStatusSchema } from 'src/database/schemas/orderStatus/orderStatus.schema';
import { OrderItem, OrderItemSchema } from 'src/database/schemas/orderItem/orderItem.schema';
import { Cart, CartSchema } from 'src/database/schemas/cart/cart.schema';
import { CartItem, CartItemSchema } from 'src/database/schemas/cartItem/cartItem.schema';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';
import { CartRepository } from 'src/database/schemas/cart/cart.repository';
import { OrderItemRepository } from 'src/database/schemas/orderItem/orderItem.repository';
import { OrderStatusRepository } from 'src/database/schemas/orderStatus/orderStatus.repository';
import { OrderStatusRecordRepository } from 'src/database/schemas/orderStatusRecord/orderStatusRecord.repository';
import { OrderRepository } from 'src/database/schemas/order/order.repository';
import { OrdersService } from './services/orders.service';
import { CartsService } from './services/carts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },                          // orders
      { name: OrderStatusRecord.name, schema: OrderStatusRecordSchema },  // orderStatusRecords
      { name: OrderStatus.name, schema: OrderStatusSchema },              // orderStatuses
      { name: OrderItem.name, schema: OrderItemSchema },                  // orderItems
      { name: Cart.name, schema: CartSchema },                            // carts
      { name: CartItem.name, schema: CartItemSchema },                    // cartItems

    ]),
    // BookingModule,
    // ServiceModule
  ],
  controllers: [OrderController],
  providers: [
    // Repositories
    OrderRepository,
    OrderStatusRecordRepository,
    OrderStatusRepository,
    OrderItemRepository,
    CartRepository,
    CartItemRepository,
    

    // Inner Services
    OrdersService,
    CartsService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    OrderRepository,
    OrderStatusRecordRepository,
    OrderStatusRepository,
    OrderItemRepository,
    CartRepository,
    CartItemRepository,

    // Inner Services
    OrdersService,
    CartsService,
  ]
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
