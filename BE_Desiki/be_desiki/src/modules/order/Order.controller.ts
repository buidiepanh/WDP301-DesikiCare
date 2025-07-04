import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, Type, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { OrdersService } from './services/orders.service';
import { CartsService } from './services/carts.service';
import { Types } from 'mongoose';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { PayosConfig } from 'src/config/payos.config';
import { PaymentsService } from './services/payments.service';
const PayOS = require('@payos/node');

@Controller('Order')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class OrderController {

  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
    private readonly paymentsService: PaymentsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Lấy giỏ hàng của người dùng hiện tại /api/Order/carts/me
  @Get('carts/me')
  async getMyCart(
    @Req() req
  ) {
    if (!req.user || !req.user._id || (req.user && req.user.role._id !== 3)) {
      return {
        cart: null,
      };
    }

    const cart = await this.cartsService.getActiveCartByAccountId(req.user._id);
    return cart;
  }


  // Thêm sản phẩm vào giỏ
  @Post('cartItems')
  @Roles("customer")
  @UseGuards(RolesGuard)
  async getCartItems(
    @Req() req,
    @Body() body: {
      productId: Types.ObjectId;
    }
  ) {
    const user = req.user;
    // if (!user || !user._id || (user && user.role._id !== 3)) {
    //   throw new BadRequestException('You do not have permission to access this action');
    // }

    const cart = await this.cartsService.addCartItemToCart(user._id, new Types.ObjectId(body.productId));
    return {
      message: 'Cart items added successfully',
    };
  }


  // Cập nhật số lượng sản phẩm
  @Put('cartItems/:cartItemId')
  @Roles("customer")
  @UseGuards(RolesGuard)
  async updateCartItemQuantity(
    @Req() req,
    @Param('cartItemId') cartItemId: string,
    @Body() body: {
      quantity: number;
    }
  ) {
    const user = req.user;
    // if (!user || !user._id || (user && user.role._id !== 3)) {
    //   throw new BadRequestException('You do not have permission to access this action');
    // }

    await this.cartsService.updateCartItemQuantity(user._id, cartItemId, body.quantity);
    return {
      message: 'Cart item quantity updated successfully',
    };
  }

  // Xóa sản phẩm khỏi giỏ
  @Delete('cartItems/:cartItemId')
  @Roles("customer")
  @UseGuards(RolesGuard)
  async deleteCartItem(
    @Req() req,
    @Param('cartItemId') cartItemId: string
  ) {
    const user = req.user;
    // if (!user || !user._id || (user && user.role._id !== 3)) {
    //   throw new BadRequestException('You do not have permission to access this action');
    // }

    await this.cartsService.deleteCartItem(user._id, cartItemId);
    return {
      message: 'Cart item deleted successfully',
    };
  }

  // Danh sách đơn hàng (tuỳ role sẽ trả list khác nhau)
  @Get('orders')
  @UseGuards(LoginJwtGuard)
  async getOrders(
    @Req() req
  ) {
    const user = req.user;

    const orders = await this.ordersService.getOrdersByAccountId(user._id);
    return {
      orders: orders,
    };
  }


  // Tạo đơn hàng từ giỏ hàng của account
  @Post('orders')
  @Roles("customer")
  @UseGuards(RolesGuard)
  async createOrderFromCart(
    @Req() req,
    @Body() body: {
      order: {
        newOrderId: Types.ObjectId | null;
        pointUsed: number;
        deliveryAddressId: Types.ObjectId;
      }
    }
  ) {
    const user = req.user;
    const order = await this.ordersService.createOrderFromActiveCart(user._id, body.order);
    return {
      message: 'Order created successfully',
    };
  }

  // Chi tiết đơn hàng (bao gồm orderItems)
  @Get('orders/:orderId')
  @UseGuards(LoginJwtGuard)
  async getOrderById(
    @Param('orderId') orderId: Types.ObjectId
  ) {
    const order = await this.ordersService.getOrderById(orderId);
    return {
      order: order,
    };
  }

  // Cập nhật trạng thái đơn hàng
  @Put('orders/:orderId/orderStatuses/:orderStatusId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async updateOrderStatus(
    @Param('orderId') orderId: Types.ObjectId,
    @Param('orderStatusId') orderStatusId: number
  ) {
    const updatedOrder = await this.ordersService.updateOrderStatus(orderId, orderStatusId);
    if (!updatedOrder) {
      throw new BadRequestException('Order not found or status update failed');
    }
    return {
      message: 'Order status updated successfully',
    };
  }

  // Danh sách trạng thái đơn hàng
  @Get('orderStatuses')
  async getOrderStatuses() {
    const orderStatuses = await this.ordersService.getOrderStatuses();
    return {
      orderStatuses: orderStatuses,
    };
  }

  // Lấy liên kết thanh toán cho giỏ hàng
  @Post('orders/:orderId/getPaymentLink')
  @UseGuards(LoginJwtGuard)
  async getPaymentLink(
    @Req() req,
    @Param('orderId') orderId: Types.ObjectId,
    @Body() body: {
      cancelUrl?: string;
      returnUrl?: string;
    }
  ) {
    const user = req.user;

    const paymentLink = await this.paymentsService.createPaymentLink(user._id, orderId, body);

    return {
      paymentLink: paymentLink,
    };
  }

  // Lấy liên kết thanh toán cho giỏ hàng đang active
  @Post('carts/getPaymentLink')
  @Roles("customer")
  @UseGuards(RolesGuard)
  async getPaymentLinkForActiveCart(
    @Req() req,
    @Body() body: {
      order: {
        pointUsed: number;
        deliveryAddressId: Types.ObjectId;
      }
      metaData: {
        cancelUrl?: string,
        returnUrl?: string,
      }
    }
  ) {
    const user = req.user;

    const paymentLink = await this.paymentsService.createPaymentLinkForActiveCart(user._id, body.order, body.metaData);

    return {
      paymentLink: paymentLink,
    };
  }

  // Xác nhận thanh toán
  @Post('confirmPayment')
  async confirmPayment(
    @Body() body: any
  ) {
    const payOS = new PayOS(
      PayosConfig.CLIENT_ID,
      PayosConfig.API_KEY,
      PayosConfig.CHEKSUM_KEY
    );

    const webhookData = payOS.verifyPaymentWebhookData(body);
    await this.paymentsService.confirmPayment(body);


  }


}
