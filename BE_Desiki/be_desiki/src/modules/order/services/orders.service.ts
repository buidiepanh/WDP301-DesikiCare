import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { OrderRepository } from 'src/database/schemas/order/order.repository';
import { OrderStatusRepository } from 'src/database/schemas/orderStatus/orderStatus.repository';
import { OrderItemRepository } from 'src/database/schemas/orderItem/orderItem.repository';
import { Connection, Types } from 'mongoose';
import { AccountsService } from 'src/modules/account/services/accounts.service';
import { InjectConnection } from '@nestjs/mongoose';
import { OrderDocument } from 'src/database/schemas/order/order.schema';
import { ProductsService } from 'src/modules/product/services/products.service';
import { CartsService } from './carts.service';
import { ShipmentProductRepository } from 'src/database/schemas/shipmentProduct/shipmentProduct.repository';
import { OrderItem } from 'src/database/schemas/orderItem/orderItem.schema';
import { AccountRepository } from 'src/database/schemas/account/account.repository';
import { CartRepository } from 'src/database/schemas/cart/cart.repository';
import { ShipmentProduct } from 'src/database/schemas/shipmentProduct/shipmentProduct.schema';
import { PaymentRepository } from 'src/database/schemas/payment/payment.repository';
import { Type } from 'class-transformer';

@Injectable()
export class OrdersService {
    constructor(
        //orders, orderStatusRecords, orderStatuses, orderItems
        private readonly orderRepository: OrderRepository,
        private readonly orderStatusRepository: OrderStatusRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly cartRepository: CartRepository,
        private readonly shipmentProductRepository: ShipmentProductRepository,
        private readonly accountRepository: AccountRepository,
        private readonly paymentRepository: PaymentRepository,

        private readonly accountsService: AccountsService,
        private readonly cartService: CartsService,
        private readonly productsService: ProductsService,

        @InjectConnection() private readonly connection: Connection,


        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getValidateCartProducts(cartItemData: any): Promise<{
        message: string,
        returnShipmentProductIds: {
            shipmentProductId: Types.ObjectId,
            quantity: number
        }[]
    }> {
        var message = '';
        var returnShipmentProductIds: {
            shipmentProductId: Types.ObjectId,
            quantity: number
        }[] = [];
        const product = await this.productsService.getExistProductById(cartItemData.product._id);
        if (!product || product.isDeactivated == true) {
            message += `Product id ${cartItemData.product._id} not found or is deactivated.`;
        } else {
            var shipmentProducts = (await this.shipmentProductRepository.findByProductId(product._id)).filter(sp => sp.isDeactivated === false && sp.shipmentId && (sp.shipmentId as any).isDeleted === false);
            if (shipmentProducts.length === 0 || shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0) === 0) {
                message += `Product id ${cartItemData.product._id} is out of stock.`;
            } else if (shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0) < cartItemData.cartItem.quantity) {
                message += `Not enough stock for product id ${cartItemData.product._id} - available: ` + shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0) + ` - requested: ${cartItemData.cartItem.quantity}`;
            } else {
                const sortedShipmentProducts = shipmentProducts.sort((a, b) => {
                    const aShipment = a.shipmentId as any;
                    const bShipment = b.shipmentId as any;
                    return new Date(aShipment.shipmentDate).getTime() - new Date(bShipment.shipmentDate).getTime();
                })
                // lọc ra mảng các shipmentProductId đi từ sớm đến muôn, để lấy quantity của shipmentProduct ra cộng đồn sao cho sum quantity == cartItem.quantity
                let sumQuantity = 0;
                for (const shipmentProduct of sortedShipmentProducts) {
                    var preSumQuantity = sumQuantity;
                    sumQuantity += shipmentProduct.quantity;

                    if (sumQuantity >= cartItemData.cartItem.quantity) {
                        console.log(`subtract quantity:cartItem.quantity: ${cartItemData.cartItem.quantity} - preSumQuantity: ${preSumQuantity} = ${cartItemData.cartItem.quantity - preSumQuantity}`);
                        returnShipmentProductIds.push({
                            shipmentProductId: shipmentProduct._id,
                            quantity: cartItemData.cartItem.quantity - preSumQuantity
                        });
                        break;
                    } else {
                        console.log(`full quantity:shipmentProduct.quantity: ${shipmentProduct.quantity} - preSumQuantity: ${preSumQuantity} = ${shipmentProduct.quantity - preSumQuantity}`);
                        returnShipmentProductIds.push({
                            shipmentProductId: shipmentProduct._id,
                            quantity: shipmentProduct.quantity
                        });
                    }
                }
            }
        }
        return {
            message: message,
            returnShipmentProductIds: returnShipmentProductIds
        };
    }

    async getExistOrderStatusById(orderStatusId: number): Promise<any> {
        const orderStatus = await this.orderStatusRepository.findById(orderStatusId);
        if (!orderStatus) {
            throw new HttpException(`Order status id ${orderStatusId} not found`, HttpStatus.NOT_FOUND);
        }
        return orderStatus;
    }

    async getExistOrderById(orderId: Types.ObjectId): Promise<OrderDocument> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new HttpException(`Order id ${orderId} not found`, HttpStatus.NOT_FOUND);
        }
        return order;
    }


    //----------- Main Functions -----------
    async getOrdersByAccountId(accountId: Types.ObjectId): Promise<any> {
        try {
            const account = await this.accountsService.getExistAccountById(accountId);

            var orders: OrderDocument[] = []
            if (account.roleId !== 3) {
                orders = await this.orderRepository.findAll();
            } else {
                orders = await this.orderRepository.findAllByAccountId(new Types.ObjectId(accountId));
            }

            const result = [];
            for (const order of orders) {
                const { orderItems, orderStatusId: orderStatus, ...orderBase } = order;
                result.push({
                    order: orderBase,
                    orderStatus: orderStatus,
                    orderItems: await Promise.all(orderItems.map(async (item) => {
                        const { shipmentProductId: shipmentProduct, ...orderItemBase } = item;
                        const { productId: product, ...shipmentProductBase } = shipmentProduct as any;

                        return {
                            orderItem: orderItemBase,
                            shipmentProduct: shipmentProductBase,
                            product: {
                                ...product,
                                imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main")
                            }

                        }
                    }
                    ))
                });
            }


            return result
        } catch (error) {
            throw new HttpException('Error fetching orders: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createOrderFromActiveCart(
        accountId: Types.ObjectId,
        order: {
            newOrderId: Types.ObjectId,
            pointUsed: number;
            deliveryAddressId: Types.ObjectId;
        }
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const existDeliveryAddresses = (await this.accountsService.getExistDeliveryAddressesByAccountId(accountId)).some(address => address._id.equals(order.deliveryAddressId));
            if (existDeliveryAddresses === false) {
                throw new HttpException(`Delivery address id ${order.deliveryAddressId} does not exist for account id ${accountId}`, HttpStatus.BAD_REQUEST);
            }

            const account = await this.accountsService.getExistAccountById(accountId);
            if (account.points < order.pointUsed) {
                throw new HttpException(`Account id ${accountId} does not have enough points - current points: ${account.points} - requested points: ${order.pointUsed}`, HttpStatus.BAD_REQUEST);
            }

            const activeCart = await this.cartService.getActiveCartByAccountId(accountId);

            const validShipmentProduct = [];
            // lập qua các cartItems lấy product kiểm 
            for (const cartItem of activeCart.cartItems) {
                console.log(cartItem)
                const { message, returnShipmentProductIds } = await this.getValidateCartProducts(cartItem);
                if (message) {
                    throw new HttpException(message, HttpStatus.BAD_REQUEST);
                }
                validShipmentProduct.push(returnShipmentProductIds);
            }
            console.log("validShipmentProduct: ", validShipmentProduct)

            const newObjectId = order.newOrderId ? new Types.ObjectId(order.newOrderId) : new Types.ObjectId();

            var totalPrice = 0;
            for (const shipmentProductIds of validShipmentProduct) {
                for (const returnShipmentProductId of shipmentProductIds) {
                    const shipmentProduct = await this.shipmentProductRepository.findById(returnShipmentProductId.shipmentProductId);
                    shipmentProduct.quantity -= returnShipmentProductId.quantity;
                    if (shipmentProduct.quantity < 0) {
                        throw new HttpException(`Not enough stock for product id ${shipmentProduct._id}`, HttpStatus.BAD_REQUEST);
                    }
                    shipmentProduct.productId = (shipmentProduct.productId as any)._id;
                    await this.shipmentProductRepository.update(shipmentProduct._id, shipmentProduct, session);
                    const orderItem: OrderItem = {
                        orderId: newObjectId,
                        quantity: returnShipmentProductId.quantity,
                        shipmentProductId: returnShipmentProductId.shipmentProductId,
                        unitPrice: activeCart.cartItems.find(item => item.product._id.equals(shipmentProduct.productId))?.product.salePrice,
                    };
                    console.log("111111111111", orderItem)

                    totalPrice += orderItem.unitPrice * orderItem.quantity;
                    await this.orderItemRepository.create(orderItem, session);
                }
            }
            totalPrice -= order.pointUsed;
            const existPayment = await this.paymentRepository.findByOrderId(new Types.ObjectId(newObjectId));
            await this.orderRepository.create({
                _id: newObjectId,
                accountId: account._id,
                orderStatusId: 1,
                pointUsed: order.pointUsed,
                deliveryAddressId: new Types.ObjectId(order.deliveryAddressId),
                totalPrice: totalPrice,
                isPaid: existPayment && existPayment.paymentStatusId === 2 ? true : false,
            }, session);

            account.points -= order.pointUsed;
            await this.accountRepository.update(account._id, account, session);

            await this.cartRepository.active(activeCart.cart._id, false, session);
            await this.cartRepository.create({
                accountId: account._id,
                isActive: true,
            }, session);

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating order:', error.message);
            throw new HttpException('Failed to create order: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async calculateOrderTotalPriceAndId(
        accountId: Types.ObjectId,
        pointUsed: number
    ): Promise<{ totalPrice: number; orderId: Types.ObjectId }> {
        // Không tạo transaction, không update DB
        const account = await this.accountsService.getExistAccountById(accountId);
        if (account.points < pointUsed) {
            throw new HttpException(`Account id ${accountId} does not have enough points - current points: ${account.points} - requested points: ${pointUsed}`, HttpStatus.BAD_REQUEST);
        }

        const activeCart = await this.cartService.getActiveCartByAccountId(accountId);

        const validShipmentProduct = [];
        for (const cartItem of activeCart.cartItems) {
            const { message, returnShipmentProductIds } = await this.getValidateCartProducts(cartItem);
            if (message) {
                throw new HttpException(message, HttpStatus.BAD_REQUEST);
            }
            validShipmentProduct.push(returnShipmentProductIds);
        }

        const newObjectId = new Types.ObjectId();
        let totalPrice = 0;
        for (const shipmentProductIds of validShipmentProduct) {
            for (const returnShipmentProductId of shipmentProductIds) {
                const shipmentProduct = await this.shipmentProductRepository.findById(returnShipmentProductId.shipmentProductId);
                // console.log("111111111111",shipmentProduct)
                // console.log("111111111111",activeCart.cartItems.find(item => item.product._id.equals(shipmentProduct.productId)))
                const orderItem = {
                    quantity: returnShipmentProductId.quantity,
                    unitPrice: activeCart.cartItems.find(item => item.product._id.equals(shipmentProduct.productId._id))?.product.salePrice,
                };
                totalPrice += orderItem.unitPrice * orderItem.quantity;
            }
        }
        totalPrice -= pointUsed;

        return {
            totalPrice,
            orderId: newObjectId,
        };
    }

    async getOrderById(
        orderId: Types.ObjectId
    ): Promise<any> {
        try {
            const order = await this.getExistOrderById(orderId);

            const { orderItems, orderStatusId: orderStatus, ...orderBase } = order;
            return {
                order: orderBase,
                orderStatus: orderStatus,
                orderItems: await Promise.all(orderItems.map(async (item) => {
                    const { shipmentProductId: shipmentProduct, ...orderItemBase } = item;
                    const { productId: product, ...shipmentProductBase } = shipmentProduct as any;
                    return {
                        orderItem: orderItemBase,
                        shipmentProduct: shipmentProductBase,
                        product: {
                            ...product,
                            imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main")
                        }
                    }
                }))
            };
        }
        catch (error) {
            throw new HttpException('Get order failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async updateOrderStatus(
        orderId: Types.ObjectId,
        orderStatusId: number
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const order = await this.getExistOrderById(orderId);
            const orderStatus = await this.getExistOrderStatusById(orderStatusId);
            order.orderStatusId = orderStatus._id;
            const updatedOrder = await this.orderRepository.update(order._id, order, session);

            await session.commitTransaction();
            return updatedOrder;
        } catch (error) {
            await session.abortTransaction();
            console.error('Error updating order status:', error.message);
            throw new HttpException('Failed to update order status: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getOrderStatuses(): Promise<any> {
        try {
            const orderStatuses = await this.orderStatusRepository.findAll();
            return orderStatuses;
        } catch (error) {
            throw new HttpException('Failed to get order statuses: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
