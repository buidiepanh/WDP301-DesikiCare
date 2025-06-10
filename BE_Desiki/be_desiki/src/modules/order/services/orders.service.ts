import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { OrderRepository } from 'src/database/schemas/order/order.repository';
import { OrderStatusRecordRepository } from 'src/database/schemas/orderStatusRecord/orderStatusRecord.repository';
import { OrderStatusRepository } from 'src/database/schemas/orderStatus/orderStatus.repository';
import { OrderItemRepository } from 'src/database/schemas/orderItem/orderItem.repository';

@Injectable()
export class OrdersService {
    constructor(
        //orders, orderStatusRecords, orderStatuses, orderItems
        private readonly orderRepository: OrderRepository,
        private readonly orderStatusRecordRepository: OrderStatusRecordRepository,
        private readonly orderStatusRepository: OrderStatusRepository,
        private readonly orderItemRepository: OrderItemRepository,


        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }



}
