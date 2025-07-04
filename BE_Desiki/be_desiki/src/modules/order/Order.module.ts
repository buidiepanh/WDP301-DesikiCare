import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderController } from './Order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { Order, OrderSchema } from 'src/database/schemas/order/order.schema';
import { OrderStatus, OrderStatusSchema } from 'src/database/schemas/orderStatus/orderStatus.schema';
import { OrderItem, OrderItemSchema } from 'src/database/schemas/orderItem/orderItem.schema';
import { Cart, CartSchema } from 'src/database/schemas/cart/cart.schema';
import { CartItem, CartItemSchema } from 'src/database/schemas/cartItem/cartItem.schema';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';
import { CartRepository } from 'src/database/schemas/cart/cart.repository';
import { OrderItemRepository } from 'src/database/schemas/orderItem/orderItem.repository';
import { OrderStatusRepository } from 'src/database/schemas/orderStatus/orderStatus.repository';
import { OrderRepository } from 'src/database/schemas/order/order.repository';
import { OrdersService } from './services/orders.service';
import { CartsService } from './services/carts.service';
import { ProductModule } from '../product/Product.module';
import { Payment, PaymentSchema } from 'src/database/schemas/payment/payment.schema';
import { PaymentStatus, PaymentStatusSchema } from 'src/database/schemas/paymentStatus/paymentStatus.schema';
import { Account } from 'src/database/schemas/account/account.schema';
import { AccountModule } from '../account/Account.module';
import { PaymentsService } from './services/payments.service';
import { PaymentRepository } from 'src/database/schemas/payment/payment.repository';
import { PaymentStatusRepository } from 'src/database/schemas/paymentStatus/paymentStatus.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },                          // orders
      { name: OrderStatus.name, schema: OrderStatusSchema },              // orderStatuses
      { name: OrderItem.name, schema: OrderItemSchema },                  // orderItems
      { name: Cart.name, schema: CartSchema },                            // carts
      { name: CartItem.name, schema: CartItemSchema },                    // cartItems
      { name: Payment.name, schema: PaymentSchema },                      // payments
      { name: PaymentStatus.name, schema: PaymentStatusSchema }           // paymentStatuses

    ]),
    ProductModule,
    AccountModule
  ],
  controllers: [OrderController],
  providers: [
    // Repositories
    OrderRepository,
    OrderStatusRepository,
    OrderItemRepository,
    CartRepository,
    CartItemRepository,
    PaymentRepository,
    PaymentStatusRepository,


    // Inner Services
    OrdersService,
    CartsService,
    PaymentsService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    OrderRepository,
    OrderStatusRepository,
    OrderItemRepository,
    CartRepository,
    CartItemRepository,
    PaymentRepository,
    PaymentStatusRepository,

    // Inner Services
    OrdersService,
    CartsService,
    PaymentsService
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
