import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { ShipmentRepository } from 'src/database/schemas/shipment/shipment.repository';
import { ShipmentProductRepository } from 'src/database/schemas/shipmentProduct/shipmentProduct.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { CategoryRepository } from 'src/database/schemas/category/category.repository';
import { ProductsService } from './products.service';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';

@Injectable()
export class ShipmentsService {
    constructor(
        private readonly shipmentRepository: ShipmentRepository,
        private readonly shipmentProductRepository: ShipmentProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly cartItemRepository: CartItemRepository,

        private readonly productsService: ProductsService,
        @InjectConnection() private readonly connection: Connection,
        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }


    //----------- Exist Checks -----------
    async getExistShipmentById(shipmentId: string): Promise<any> {
        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) {
            throw new HttpException('Shipment not found: id ' + shipmentId, HttpStatus.NOT_FOUND);
        }
        return shipment;
    }

    async getExistShipmentProductById(shipmentProductId: Types.ObjectId): Promise<any> {
        const shipmentProduct = await this.shipmentProductRepository.findById(shipmentProductId);
        if (!shipmentProduct) {
            throw new HttpException('Shipment product not found: id ' + shipmentProductId, HttpStatus.NOT_FOUND);
        }
        return shipmentProduct;
    }

    //----------- Main functions -----------
    async getShipments() {
        try {
            const shipments = await this.shipmentRepository.findAll();
            const result = [];
            for (const shipment of shipments) {
                const { shipmentProducts, ...shipmentBase } = shipment;
                result.push({
                    shipment: shipmentBase,
                    shipmentProducts: await Promise.all(shipmentProducts.map(async sp => {
                        const { productId: product, ...spBase } = sp;
                        return {
                            shipmentProduct: spBase,
                            product: {
                                ...product,
                                imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), sp.productId._id, "main"),
                            },
                            category: await this.categoryRepository.findById((product as any).categoryId),
                        }
                    })),
                });
            }
            return result;
        } catch (error) {
            throw new HttpException('Get shipments failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createShipment(
        shipment: {
            _id: string,
            shipmentDate: Date
        }
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const newShipment = await this.shipmentRepository.create(shipment, session);
            await session.commitTransaction();
            return {
                message: "Shipment created successfully",
            };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Create shipment failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getShipmentById(
        shipmentId: string
    ) {
        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) {
            throw new HttpException('Shipment not found: id ' + shipmentId, HttpStatus.NOT_FOUND);
        }
        const { shipmentProducts, ...shipmentBase } = shipment;
        return {
            shipment: shipmentBase,
            shipmentProducts: await Promise.all(shipmentProducts.map(async sp => {
                const { productId: product, ...spBase } = sp;
                return {
                    shipmentProduct: spBase,
                    product: {
                        ...product,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), sp.productId._id, "main"),
                    },
                    category: await this.categoryRepository.findById((product as any).categoryId),
                }
            })),
        };
    }

    async updateShipment(
        shipmentId: string,
        shipmentData: {
            shipmentDate: Date
        }
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const updateShipment = await this.getExistShipmentById(shipmentId);
            updateShipment.shipmentDate = shipmentData.shipmentDate;

            const updatedShipment = await this.shipmentRepository.update(shipmentId, updateShipment, session);
            await session.commitTransaction();
            return updatedShipment;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update shipment failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deleteShipment(
        shipmentId: string
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistShipmentById(shipmentId);

            await this.shipmentRepository.delete(shipmentId, session);
            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Delete shipment failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getShipmentProductById(
        shipmentProductId: Types.ObjectId
    ) {
        const shipmentProduct = await this.shipmentProductRepository.findById(shipmentProductId);
        if (!shipmentProduct) {
            throw new HttpException('Shipment product not found: id ' + shipmentProductId, HttpStatus.NOT_FOUND);
        }

        const { productId: product, shipmentId: shipment, ...spBase } = shipmentProduct;

        if (!product) {
            throw new HttpException('Product not found in shipment product: id ' + shipmentProductId, HttpStatus.NOT_FOUND);
        }
        if (!shipment) {
            throw new HttpException('Shipment not found in shipment product: id ' + shipmentProductId, HttpStatus.NOT_FOUND);
        }
        return {
            shipmentProduct: spBase,
            product: {
                ...product,
                imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main"),
            },
            shipment: shipment,
        };
    }

    async updateShipmentProduct(
        shipmentProductId: Types.ObjectId,
        shipmentProductData: {
            quantity: number;
            manufacturingDate: Date;
            expiryDate: Date;
            buyPrice: number;
        }
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const shipmentProduct = await this.shipmentProductRepository.findById(shipmentProductId);
            if (!shipmentProduct) {
                throw new HttpException('Shipment product not found: id ' + shipmentProductId, HttpStatus.NOT_FOUND);
            }

            const shipmentProductUpdate = {
                ...shipmentProductData,
                productId: new Types.ObjectId((shipmentProduct.productId as any)._id),
                shipmentId: shipmentProduct.shipmentId,
            }
            const updatedShipmentProduct = await this.shipmentProductRepository.update(shipmentProductId, shipmentProductUpdate, session);
            await session.commitTransaction();
            return updatedShipmentProduct;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update shipment product failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async registerShipmentProduct(
        shipmentProduct: {
            productId: Types.ObjectId;
            shipmentId: string;
            quantity: number;
            manufacturingDate: Date;
            expiryDate: Date;
            buyPrice: number;
        }
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.productsService.getExistProductById(shipmentProduct.productId);
            await this.getExistShipmentById(shipmentProduct.shipmentId);

            shipmentProduct.productId = new Types.ObjectId(shipmentProduct.productId);
            const newShipmentProduct = await this.shipmentProductRepository.create(shipmentProduct, session);
            await session.commitTransaction();
            return newShipmentProduct;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Register shipment product failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deactivateShipmentProduct(
        shipmentProductId: Types.ObjectId,
        isDeactivate: boolean
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistShipmentProductById(shipmentProductId);

            const updatedShipmentProduct = await this.shipmentProductRepository.deactivate(shipmentProductId, isDeactivate, session);
            await session.commitTransaction();
            const existingShipmentProductByProductId = (await this.shipmentProductRepository.findByProductId(updatedShipmentProduct.productId)).filter(sp => sp.isDeactivated === false);

            if (existingShipmentProductByProductId.length === 0) {
                await this.cartItemRepository.deleteMany({ productId: updatedShipmentProduct.productId }, session);
            }

            return updatedShipmentProduct;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Deactivate shipment product failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

}
