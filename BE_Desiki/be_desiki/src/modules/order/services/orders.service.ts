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
import { getCurrentDateWithTimezone, addTimeToCurrentDate, isNearExpiry, isFutureDate } from 'src/common/utils/date.util';
import { OrderPriceBaseGameTicketRewardRepository } from 'src/database/schemas/orderPriceBaseGameTicketReward/orderPriceBaseGameTicketReward.repository';


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
        private readonly orderPriceBaseGameTicketRewardRepository: OrderPriceBaseGameTicketRewardRepository,

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
        availableQuantity: number,
        requestedQuantity: number,
        product?: any,
        returnShipmentProductIds: {
            shipmentProductId: Types.ObjectId,
            quantity: number
        }[]
    }> {
        var message = '';
        var availableQuantity = 0;
        var returnShipmentProductIds: {
            shipmentProductId: Types.ObjectId,
            quantity: number
        }[] = [];
        const product = await this.productsService.getExistProductById(cartItemData.product._id);
        if (!product || product.isDeactivated == true) {
            message += `Product id ${cartItemData.product._id} not found or is deactivated.`;
            return {
                message: message,
                availableQuantity: 0,
                requestedQuantity: cartItemData.cartItem.quantity,
                product: product,
                returnShipmentProductIds: []
            };
        } else {
            var shipmentProducts = (await this.shipmentProductRepository.findByProductId(product._id)).filter(sp => sp.isDeactivated === false && sp.shipmentId && (sp.shipmentId as any).isDeleted === false);
            if (shipmentProducts.length === 0 || shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0) === 0) {
                message += `Product id ${cartItemData.product._id} is out of stock.`;
                return {
                    message: message,
                    availableQuantity: shipmentProducts.length === 0 ? 0 : shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0),
                    requestedQuantity: cartItemData.cartItem.quantity,
                    product: product,
                    returnShipmentProductIds: []
                }
            } else if (shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0) < cartItemData.cartItem.quantity) {
                message += `Not enough stock for product id ${cartItemData.product._id} - available: ` + shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0) + ` - requested: ${cartItemData.cartItem.quantity}`;
                return {
                    message: message,
                    availableQuantity: shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0),
                    requestedQuantity: cartItemData.cartItem.quantity,
                    product: product,
                    returnShipmentProductIds: []
                };
            } else {
                // const sortedShipmentProducts = shipmentProducts.sort((a, b) => {
                //     const aShipment = a.shipmentId as any;
                //     const bShipment = b.shipmentId as any;
                //     return new Date(aShipment.shipmentDate).getTime() - new Date(bShipment.shipmentDate).getTime();
                // })

                // Sort ra các shipmentProducts theo ngày expiryDate gần nhất (loại bỏ các shipmentProduct đã hết hạn), expiryDate có dạng 2026-05-05T00:00:00.000+00:00
                const sortedShipmentProducts = shipmentProducts
                    .filter(sp => {
                        if (!sp.expiryDate) return false;
                        return isFutureDate(sp.expiryDate); // Loại bỏ các shipmentProduct đã hết hạn
                    })
                    .sort((a, b) => {
                        const aExpiryDate = new Date(a.expiryDate);
                        const bExpiryDate = new Date(b.expiryDate);

                        // Ưu tiên sản phẩm gần hết hạn (trong vòng 1 tháng) lên đầu
                        const aIsNearExpiry = isNearExpiry(aExpiryDate, 1, 'month');
                        const bIsNearExpiry = isNearExpiry(bExpiryDate, 1, 'month');

                        if (aIsNearExpiry && !bIsNearExpiry) {
                            return -1;
                        }
                        if (!aIsNearExpiry && bIsNearExpiry) {
                            return 1;
                        }

                        return aExpiryDate.getTime() - bExpiryDate.getTime();
                    });

                // lọc ra mảng các shipmentProductId đi từ sớm đến muôn, để lấy quantity của shipmentProduct ra cộng đồn sao cho sum quantity == cartItem.quantity
                let sumQuantity = 0;
                for (const shipmentProduct of sortedShipmentProducts) {
                    var availableQuantity = shipmentProduct.importQuantity - shipmentProduct.saleQuantity;
                    var preSumQuantity = sumQuantity;
                    // sumQuantity += shipmentProduct.quantity;
                    sumQuantity += availableQuantity;
                    if (sumQuantity >= cartItemData.cartItem.quantity) {
                        console.log(`subtract quantity:cartItem.quantity: ${cartItemData.cartItem.quantity} - preSumQuantity: ${preSumQuantity} = ${cartItemData.cartItem.quantity - preSumQuantity}`);
                        returnShipmentProductIds.push({
                            shipmentProductId: shipmentProduct._id,
                            quantity: cartItemData.cartItem.quantity - preSumQuantity
                        });
                        break;
                    } else {
                        console.log(`full quantity:shipmentProduct.quantity: ${availableQuantity} - preSumQuantity: ${preSumQuantity} = ${availableQuantity - preSumQuantity}`);
                        returnShipmentProductIds.push({
                            shipmentProductId: shipmentProduct._id,
                            quantity: availableQuantity
                        });
                    }
                }
            }
        }
        return {
            message: message,
            availableQuantity: shipmentProducts.reduce((acc, sp) => acc + (sp.importQuantity - sp.saleQuantity), 0),
            requestedQuantity: cartItemData.cartItem.quantity,
            product: product,
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
    ): Promise<{
        newOrderId: Types.ObjectId;
        refundPoints?: number;
        gameTicketReward?: number;
        outOfStockProducts?: any[];
    }> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const newObjectId = order.newOrderId ? new Types.ObjectId(order.newOrderId) : new Types.ObjectId();
            const existPayment = await this.paymentRepository.findByOrderId(new Types.ObjectId(newObjectId));

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
            const inValidCartProducts = [];
            // lập qua các cartItems lấy product kiểm 
            for (const cartItem of activeCart.cartItems) {
                console.log(cartItem)
                const validatedCartProduct = await this.getValidateCartProducts(cartItem);
                if (validatedCartProduct.message) {
                    inValidCartProducts.push(validatedCartProduct);
                }
                validShipmentProduct.push(validatedCartProduct.returnShipmentProductIds);
            }
            console.log("validShipmentProduct: ", validShipmentProduct)
            if (inValidCartProducts.length > 0) {
                // nếu đã thanh toán rồi thì refund point = existPayment.amount + order.pointUsed
                var refundPoints = order.pointUsed;
                if (existPayment && existPayment.paymentStatusId === 2) {
                    refundPoints = existPayment.amount;
                    account.points += refundPoints;
                    await this.accountRepository.update(account._id, account, session);
                    await session.commitTransaction();
                }
                return {
                    newOrderId: null,
                    refundPoints: refundPoints,
                    gameTicketReward: 0,
                    outOfStockProducts: await Promise.all(inValidCartProducts.map(async product => ({
                        availableQuantity: product.availableQuantity,
                        requestedQuantity: product.requestedQuantity,
                        product: {
                            ...product.product,
                            imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product.product._id, "main")
                        },
                    })))
                }
            }


            var totalPrice = 0;
            var totalRewardTickets = 0;
            for (const shipmentProductIds of validShipmentProduct) {
                for (const returnShipmentProductId of shipmentProductIds) {
                    const shipmentProduct = await this.shipmentProductRepository.findById(returnShipmentProductId.shipmentProductId);

                    // Validation thời gian thực trong transaction để tránh race condition
                    const currentAvailableQuantity = shipmentProduct.importQuantity - shipmentProduct.saleQuantity;
                    if (currentAvailableQuantity < returnShipmentProductId.quantity) {
                        throw new HttpException(`Not enough stock for shipment product id ${shipmentProduct._id} - available: ${currentAvailableQuantity} - requested: ${returnShipmentProductId.quantity}`, HttpStatus.BAD_REQUEST);
                    }

                    shipmentProduct.saleQuantity += returnShipmentProductId.quantity;
                    // Double check sau khi cộng (không cần thiết nếu validation trên đã đúng, nhưng để đảm bảo)
                    if (shipmentProduct.saleQuantity > shipmentProduct.importQuantity) {
                        throw new HttpException(`Stock calculation error for product id ${shipmentProduct._id}`, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    shipmentProduct.productId = (shipmentProduct.productId as any)._id;
                    await this.shipmentProductRepository.update(shipmentProduct._id, shipmentProduct, session);
                    const orderItem: OrderItem = {
                        orderId: newObjectId,
                        quantity: returnShipmentProductId.quantity,
                        shipmentProductId: returnShipmentProductId.shipmentProductId,
                        unitPrice: activeCart.cartItems.find(item => item.product._id.equals(shipmentProduct.productId))?.product.salePrice,
                    };
                    // console.log("111111111111", orderItem)

                    totalPrice += orderItem.unitPrice * orderItem.quantity;
                    await this.orderItemRepository.create(orderItem, session);

                    totalRewardTickets += (shipmentProduct.productId as any).gameTicketReward;

                }
            }
            totalPrice -= order.pointUsed;
            totalRewardTickets += await this.orderPriceBaseGameTicketRewardRepository.getGameTicketRewardByPrice(totalPrice);



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
            account.gameTicketCount += totalRewardTickets;
            await this.accountRepository.update(account._id, account, session);

            await this.cartRepository.active(activeCart.cart._id, false, session);
            await this.cartRepository.create({
                accountId: account._id,
                isActive: true,
            }, session);


            await session.commitTransaction();
            return {
                newOrderId: newObjectId,
                refundPoints: null,
                gameTicketReward: totalRewardTickets,
                outOfStockProducts: null
            };

        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating order:', error.message);
            throw new HttpException('Failed to create order: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getRevenueDashboard(startDate?: string, endDate?: string): Promise<any> {
        try {
            let start: Date | null = null;
            let end: Date | null = null;

            // Xử lý logic cho các trường hợp khác nhau
            if (startDate && endDate) {
                // Có cả Start và End => lấy từ 00:00 của Start đến 23:59:59 của End
                const [startDay, startMonth, startYear] = startDate.split('-').map(Number);
                const [endDay, endMonth, endYear] = endDate.split('-').map(Number);

                start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
                end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
            }
            else if (startDate && !endDate) {
                // Chỉ có Start => lấy từ 00:00 đến 23:59:59 của StartDate
                const [startDay, startMonth, startYear] = startDate.split('-').map(Number);

                start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
                end = new Date(startYear, startMonth - 1, startDay, 23, 59, 59, 999);
            }
            else if (!startDate && endDate) {
                // Chỉ có End => lấy tất cả từ trước đến 23:59:59 của EndDate
                const [endDay, endMonth, endYear] = endDate.split('-').map(Number);

                start = null; // Không giới hạn start
                end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
            }
            // Nếu không có cả hai => lấy tất cả orders với status = 3

            console.log('Date range:', { start, end });

            // Sử dụng repository method đã tối ưu
            const orders = await this.orderRepository.findOrdersForRevenueDashboard(start, end);

            console.log(`Found ${orders.length} orders matching criteria`);

            // Process orders
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

            return result;
        } catch (error) {
            throw new HttpException('Error fetching revenue dashboard: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

            if (orderStatusId == 4) { // huỷ đơn hoàn trả số lượng về stock trong shipmentProduct
                for (const orderItem of order.orderItems) {
                    const shipmentProduct = await this.shipmentProductRepository.findById(orderItem.shipmentProductId);
                    if (!shipmentProduct) {
                        throw new HttpException(`Shipment product id ${orderItem.shipmentProductId} not found`, HttpStatus.NOT_FOUND);
                    }
                    shipmentProduct.saleQuantity -= orderItem.quantity;
                    if (shipmentProduct.saleQuantity < 0) {
                        throw new HttpException(`Sale quantity for shipment product id ${shipmentProduct._id} cannot be negative`, HttpStatus.BAD_REQUEST);
                    }
                    await this.shipmentProductRepository.update(shipmentProduct._id, shipmentProduct, session);
                }
                // hoàn point về tài khoản = order.totalPrice + order.pointUsed
                const account = await this.accountsService.getExistAccountById(order.accountId);
                account.points += order.totalPrice + order.pointUsed;
                await this.accountRepository.update(account._id, account, session);
            }

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

    async cancelOrder(
        accountId: Types.ObjectId,
        orderId: Types.ObjectId
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const order = await this.getExistOrderById(orderId);
            if (order.accountId.toString() !== accountId.toString()) {
                throw new HttpException(`Order id ${orderId} does not belong to account id ${accountId}`, HttpStatus.FORBIDDEN);
            }

            order.orderStatusId = 4;
            await this.orderRepository.update(order._id, order, session);

            for (const orderItem of order.orderItems) {
                const shipmentProduct = await this.shipmentProductRepository.findById(orderItem.shipmentProductId);
                if (!shipmentProduct) {
                    throw new HttpException(`Shipment product id ${orderItem.shipmentProductId} not found`, HttpStatus.NOT_FOUND);
                }
                shipmentProduct.saleQuantity -= orderItem.quantity;
                if (shipmentProduct.saleQuantity < 0) {
                    throw new HttpException(`Sale quantity for shipment product id ${shipmentProduct._id} cannot be negative`, HttpStatus.BAD_REQUEST);
                }
                await this.shipmentProductRepository.update(shipmentProduct._id, shipmentProduct, session);
            }
            // hoàn point về tài khoản = order.totalPrice
            const account = await this.accountsService.getExistAccountById(order.accountId);
            account.points += order.totalPrice;
            await this.accountRepository.update(account._id, account, session);

            await session.commitTransaction();
            return order;
        } catch (error) {
            await session.abortTransaction();
            console.error('Error cancelling order:', error.message);
            throw new HttpException('Failed to cancel order: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

    // OrderPriceBaseGameTicketReward CRUD operations
    async getOrderPriceBaseGameTicketRewards(): Promise<any> {
        try {
            const orderPriceBaseGameTicketRewards = await this.orderPriceBaseGameTicketRewardRepository.findAll();
            return orderPriceBaseGameTicketRewards;
        } catch (error) {
            throw new HttpException('Failed to get order price base game ticket rewards: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createOrderPriceBaseGameTicketReward(orderPriceBaseGameTicketReward: {
        orderPriceThreshold: number;
        gameTicketReward: number;
    }): Promise<any> {
        try {
            // Kiểm tra xem orderPriceThreshold đã tồn tại chưa
            const existingReward = await this.orderPriceBaseGameTicketRewardRepository.findByOrderPriceThresholdExact(orderPriceBaseGameTicketReward.orderPriceThreshold);
            if (existingReward) {
                throw new HttpException('Order price threshold already exists', HttpStatus.BAD_REQUEST);
            }

            const newReward = await this.orderPriceBaseGameTicketRewardRepository.create(orderPriceBaseGameTicketReward);
            return newReward;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to create order price base game ticket reward: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateOrderPriceBaseGameTicketReward(
        orderPriceBaseGameTicketRewardId: Types.ObjectId,
        orderPriceBaseGameTicketReward: {
            orderPriceThreshold: number;
            gameTicketReward: number;
        }
    ): Promise<any> {
        try {
            // Kiểm tra xem reward với id này có tồn tại không
            const existingReward = await this.orderPriceBaseGameTicketRewardRepository.findById(orderPriceBaseGameTicketRewardId);
            if (!existingReward) {
                throw new HttpException('Order price base game ticket reward not found', HttpStatus.NOT_FOUND);
            }

            // Kiểm tra xem orderPriceThreshold mới có trùng với record khác không (trừ record hiện tại)
            const duplicateReward = await this.orderPriceBaseGameTicketRewardRepository.findByOrderPriceThresholdExcluding(
                orderPriceBaseGameTicketReward.orderPriceThreshold,
                orderPriceBaseGameTicketRewardId
            );
            if (duplicateReward) {
                throw new HttpException('Order price threshold already exists', HttpStatus.BAD_REQUEST);
            }

            const updatedReward = await this.orderPriceBaseGameTicketRewardRepository.update(
                orderPriceBaseGameTicketRewardId,
                orderPriceBaseGameTicketReward
            );
            return updatedReward;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to update order price base game ticket reward: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteOrderPriceBaseGameTicketReward(orderPriceBaseGameTicketRewardId: Types.ObjectId): Promise<any> {
        try {
            const existingReward = await this.orderPriceBaseGameTicketRewardRepository.findById(orderPriceBaseGameTicketRewardId);
            if (!existingReward) {
                throw new HttpException('Order price base game ticket reward not found', HttpStatus.NOT_FOUND);
            }

            const deletedReward = await this.orderPriceBaseGameTicketRewardRepository.delete(orderPriceBaseGameTicketRewardId);
            return deletedReward;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to delete order price base game ticket reward: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
