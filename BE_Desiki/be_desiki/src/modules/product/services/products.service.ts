import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { ProductRepository } from 'src/database/schemas/product/product.repository';
import { CategoryRepository } from 'src/database/schemas/category/category.repository';
import { ShipmentRepository } from 'src/database/schemas/shipment/shipment.repository';
import { ShipmentProductRepository } from 'src/database/schemas/shipmentProduct/shipmentProduct.repository';
import { Connection, Types } from 'mongoose';
import { SkinTypeRepository } from 'src/database/schemas/skinType/skinType.repository';
import { SkinStatusRepository } from 'src/database/schemas/skinStatus/skinStatus.repository';
import { SkinsService } from './skins.service';
import { InjectConnection } from '@nestjs/mongoose';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly cartItemRepository: CartItemRepository,

        private readonly skinService: SkinsService,
        @InjectConnection() private readonly connection: Connection,

        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistProductById(productId: Types.ObjectId): Promise<any> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new HttpException('Product not found: id ' + productId, HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async getExistCategoryById(categoryId: number): Promise<any> {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new HttpException('Category not found: id ' + categoryId, HttpStatus.NOT_FOUND);
        }
        return category;
    }



    //----------- Main functions -----------

    async getProducts() {
        try {
            const products = await this.productRepository.findAll();
            const result = [];
            for (const product of products) {
                const { category, shipmentProducts, productSkinTypes, productSkinStatuses, ...productBase } = product;
                result.push({
                    product: {
                        ...productBase,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main"),
                    },
                    category: category,
                    shipmentProducts: shipmentProducts.map(shipmentProduct => {
                        const { shipmentId: shipment, ...shipmentProductBase } = shipmentProduct;
                        return {
                            shipment: shipment,
                            shipmentProduct: shipmentProductBase
                        }
                    }),
                    productSkinTypes: productSkinTypes.map(productSkinType => productSkinType.skinTypeId),
                    productSkinStatuses: productSkinStatuses.map(productSkinStatus => productSkinStatus.skinStatusId)
                });
            }

            return result;
        } catch (error) {
            throw new HttpException('Get products failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createProduct(productData: {
        product: {
            categoryId: number;
            name: string;
            description: string;
            volume: number;
            salePrice: number;
            imageBase64: string;
        },
        skinTypeIds?: number[];
        skinStatusIds?: number[];
    }) {

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            await this.getExistCategoryById(productData.product.categoryId);

            const addedProduct = await this.productRepository.create(productData.product, session);

            const folderPath = this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH') + `/${addedProduct._id}`;

            await this.fileService.createFolder(folderPath);
            if (productData.product.imageBase64) {
                await this.fileService.saveBase64File(productData.product.imageBase64, folderPath, "main");
            } else {
                const sourcePath = this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH');
                const destinationPath = folderPath;
                const sourceFileName = 'unknown.jpg';
                const destinationFileName = 'main.jpg';
                await this.fileService.copyFile(sourcePath, sourceFileName, destinationPath, destinationFileName);
            }

            await this.skinService.addSkinTypesToProduct(addedProduct._id, productData.skinTypeIds || []);
            await this.skinService.addSkinStatusesToProduct(addedProduct._id, productData.skinStatusIds || []);

            await session.commitTransaction();
            return addedProduct;
        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating product:', error);
            throw new HttpException('Create product failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getProductById(productId: Types.ObjectId) {
        try {
            const product = await this.productRepository.findById(productId);
            const { category, shipmentProducts, productSkinTypes, productSkinStatuses, ...productBase } = product;
            return {
                product: {
                    ...productBase,
                    imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main"),
                },
                category: category,
                shipmentProducts: shipmentProducts.map(shipmentProduct => {
                    const { shipmentId: shipment, ...shipmentProductBase } = shipmentProduct;
                    return {
                        shipment: shipment,
                        shipmentProduct: shipmentProductBase
                    }
                }),
                productSkinTypes: productSkinTypes.map(productSkinType => productSkinType.skinTypeId),
                productSkinStatuses: productSkinStatuses.map(productSkinStatus => productSkinStatus.skinStatusId)
            };
        } catch (error) {
            throw new HttpException('Get product by id failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProduct(
        productId: Types.ObjectId,
        product: {
            product: {
                categoryId: number;
                name: string;
                description: string;
                volume: number;
                salePrice: number;
                imageBase64?: string;
            },
            skinTypeIds?: number[];
            skinStatusIds?: number[];
        }) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistProductById(productId);
            await this.getExistCategoryById(product.product.categoryId);

            const { product: productData, skinTypeIds, skinStatusIds } = product;

            const updatedProduct = await this.productRepository.update(productId, productData, session);

            await this.skinService.addSkinTypesToProduct(updatedProduct._id, skinTypeIds || []);

            await this.skinService.addSkinStatusesToProduct(updatedProduct._id, skinStatusIds || []);

            const folderPath = this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH') + `/${updatedProduct._id}`;
            if (productData.imageBase64) {
                await this.fileService.deleteFile(folderPath, "main");
                await this.fileService.saveBase64File(productData.imageBase64, folderPath, "main");
            }
            await session.commitTransaction();
            return updatedProduct;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update product failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deactivateProduct(
        productId: Types.ObjectId,
        isDeactivate: boolean
    ) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistProductById(productId);
            const updatedProduct = await this.productRepository.deactivate(productId, isDeactivate, session);
            await session.commitTransaction();

            if (updatedProduct.isDeactivated === true) {
                await this.cartItemRepository.deleteMany({ productId: updatedProduct._id }, session);
            }

            return updatedProduct;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException(`${isDeactivate === false ? "Activate" : "Deactivate"} product failed: ` + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getCategories() {
        try {
            const categories = await this.categoryRepository.findAll();
            return categories;
        } catch (error) {
            throw new HttpException('Get categories failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
