import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { OrderRepository } from 'src/database/schemas/order/order.repository';
import { OrderStatusRepository } from 'src/database/schemas/orderStatus/orderStatus.repository';
import { OrderItemRepository } from 'src/database/schemas/orderItem/orderItem.repository';
import { PaymentRepository } from 'src/database/schemas/payment/payment.repository';
import { PaymentStatusRepository } from 'src/database/schemas/paymentStatus/paymentStatus.repository';
import { Connection, Types } from 'mongoose';
import { PayosConfig } from 'src/config/payos.config';
import { OrdersService } from './orders.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Payment } from 'src/database/schemas/payment/payment.schema';

const PayOS = require('@payos/node');

@Injectable()
export class PaymentsService {
    constructor(
        //orders, orderStatusRecords, orderStatuses, orderItems
        private readonly paymentRepository: PaymentRepository,
        private readonly paymentStatusRepository: PaymentStatusRepository,
        private readonly orderRepository: OrderRepository,

        private readonly ordersService: OrdersService,

        @InjectConnection() private readonly connection: Connection,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistPaymentById(paymentId: Types.ObjectId): Promise<Payment> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new HttpException('Payment not found: id ' + paymentId, HttpStatus.NOT_FOUND);
        }
        return payment;
    }

    //----------- Main Functions -----------

    async createPaymentLink(
        accountId: Types.ObjectId,
        orderId: Types.ObjectId,
        metaData: {
            cancelUrl?: string,
            returnUrl?: string,
        }
    ): Promise<string> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const order = (await this.ordersService.getOrderById(orderId)).order;
            if (order.isPaid == true) {
                throw new HttpException(`order id ${order._id.toString()} has already been paid`, HttpStatus.BAD_REQUEST);
            }


            const payOS = new PayOS(
                PayosConfig.CLIENT_ID,
                PayosConfig.API_KEY,
                PayosConfig.CHEKSUM_KEY
            );

            const random15Digit = Math.floor(Math.random() * 900000000000000) + 100000000000000;
            const body = {
                orderCode: random15Digit,
                amount: order.totalPrice,
                description: order._id.toString(),
                cancelUrl: metaData.cancelUrl,
                returnUrl: metaData.returnUrl,
            };

            const paymentLinkRes = await payOS.createPaymentLink(body);

            await this.paymentRepository.create({
                _id: random15Digit,
                orderId: order._id,
                amount: order.totalPrice,
                paymentStatusId: 1,
                accountId: new Types.ObjectId(accountId),

            }, session);
            await session.commitTransaction();
            return paymentLinkRes.checkoutUrl
        } catch (error) {
            await session.abortTransaction();
            console.error("Error creating payment link: ", error);
            throw new HttpException('Failed to create payment link: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }

    }

    async createPaymentLinkForActiveCart(
        accountId: Types.ObjectId,
        order: {
            pointUsed: number;
            deliveryAddressId: Types.ObjectId;
        },
        metaData: {
            cancelUrl?: string,
            returnUrl?: string,
        }
    ): Promise<string> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const newOrder = await this.ordersService.calculateOrderTotalPriceAndId(accountId, order.pointUsed);
            console.log("newOrder: ", newOrder);
            const payOS = new PayOS(
                PayosConfig.CLIENT_ID,
                PayosConfig.API_KEY,
                PayosConfig.CHEKSUM_KEY
            );

            const random15Digit = Math.floor(Math.random() * 900000000000000) + 100000000000000;
            const body = {
                orderCode: random15Digit,
                amount: newOrder.totalPrice,
                description: newOrder.orderId.toString(),
                cancelUrl: metaData.cancelUrl,
                returnUrl: metaData.returnUrl + `?newOrderId=${newOrder.orderId.toString()}&pointUsed=${order.pointUsed}&deliveryAddressId=${order.deliveryAddressId.toString()}`,
            };

            const paymentLinkRes = await payOS.createPaymentLink(body);

            const newPayment = await this.paymentRepository.create({
                _id: random15Digit,
                orderId: newOrder.orderId,
                amount: newOrder.totalPrice,
                paymentStatusId: 1,
                accountId: new Types.ObjectId(accountId),

            }, session);
            await session.commitTransaction();
            return paymentLinkRes.checkoutUrl;
        } catch (error) {
            await session.abortTransaction();
            console.error("Error creating payment link for active cart: ", error);
            throw new HttpException('Failed to create payment link for active cart', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async confirmPayment(webhookData: any): Promise<void> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const orderId = new Types.ObjectId((webhookData.data.description as string).split(' ')[1]);

            const order = await this.orderRepository.findById(orderId);

            // await this.orderRepository.update(orderId, order, session);

            const payment = await this.getExistPaymentById(webhookData.data.orderCode);
            console.log("order: ", order);
            console.log("webhookData: ", webhookData);
            if (webhookData.code === '00') {
                payment.paymentStatusId = 2;
                // if (!order) {
                //     const deliveryAddressId = new Types.ObjectId((webhookData.data.description as string).split(' ')[2]);
                //     const accountId = new Types.ObjectId((webhookData.data.description as string).split(' ')[3]);
                //     const pointUsed = parseInt((webhookData.data.description as string).split(' ')[4], 10);
                //     await this.ordersService.createOrderFromActiveCart(accountId, {
                //         newOrderId: orderId,
                //         pointUsed: pointUsed,
                //         deliveryAddressId: deliveryAddressId,
                //         isPaid: true,
                //     });
                // } else {
                //     order.isPaid = true;
                //     await this.orderRepository.update(orderId, order, session);
                // }
                if (order) {
                    order.isPaid = true;
                    await this.orderRepository.update(orderId, order, session);
                }
            } else {
                payment.paymentStatusId = 3;
            }

            await this.paymentRepository.update(payment._id, payment, session);


            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error("Error confirming payment: ", error);
            throw new HttpException('Failed to confirm payment', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }


}
