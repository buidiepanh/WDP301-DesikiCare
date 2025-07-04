import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { CartRepository } from 'src/database/schemas/cart/cart.repository';
import { CartItemRepository } from 'src/database/schemas/cartItem/cartItem.repository';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AccountsService } from 'src/modules/account/services/accounts.service';
import { ProductsService } from 'src/modules/product/services/products.service';
import { ShipmentsService } from 'src/modules/product/services/shipments.service';
import { ShipmentProductRepository } from 'src/database/schemas/shipmentProduct/shipmentProduct.repository';

@Injectable()
export class CartsService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly cartItemRepository: CartItemRepository,
        private readonly shipmentProductRepository: ShipmentProductRepository,

        private readonly accountsService: AccountsService,
        private readonly productsService: ProductsService,
        private readonly shipmentsService: ShipmentsService,

        @InjectConnection() private readonly connection: Connection,
        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistCartById(cartId: string): Promise<any> {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            throw new HttpException('Cart not found: id ' + cartId, HttpStatus.NOT_FOUND);
        }
        return cart;
    }

    async getExistCartItemById(cartItemId: string): Promise<any> {
        const cartItem = await this.cartItemRepository.findById(cartItemId);
        if (!cartItem) {
            throw new HttpException('Cart item not found: id ' + cartItemId, HttpStatus.NOT_FOUND);
        }
        return cartItem;
    }
    //----------- Main Functions -----------

    async getActiveCartByAccountId(accountId: Types.ObjectId): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.accountsService.getExistAccountById(accountId);

            const cart = await this.cartRepository.findActiveByAccountId(new Types.ObjectId(accountId));
            if (!cart) {
                const addedCart = await this.cartRepository.create({
                    accountId: new Types.ObjectId(accountId),
                    isActive: true,
                }, session);
                await session.commitTransaction();

                return {
                    cart: addedCart,
                    cartItems: []
                };
            } else {
                const { cartItems, ...cartBase } = cart;
                return {
                    cart: cartBase,
                    cartItems: cartItems.map(item => {
                        const { productId: product, ...cartItemBase } = item;
                        return {
                            cartItem: cartItemBase,
                            product: product
                        }
                    })
                }
            }
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException("Get cart by account error: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }

    }

    async addCartItemToCart(
        accountId: Types.ObjectId,
        productId: Types.ObjectId
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.accountsService.getExistAccountById(accountId);

            const product = await this.productsService.getExistProductById(productId);
            const shipmentProducts = (await this.shipmentProductRepository.findByProductId(productId)).filter(sp => sp.isDeactivated === false && sp.shipmentId && (sp.shipmentId as any).isDeleted === false);

            if (product.isDeactivated === true || shipmentProducts.length === 0 || shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0) < 1) {
                throw new HttpException('Product is not available', HttpStatus.BAD_REQUEST);
            }

            const existingActiveCart = await this.getActiveCartByAccountId(accountId);

            const existingCartItem = await this.cartItemRepository.findByCartIdAndProductId(existingActiveCart.cart._id , new Types.ObjectId(productId));


            if (existingCartItem) {
                const quantity = existingCartItem.quantity + 1;
                if (quantity > shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0)) {
                    throw new HttpException('Not enough stock for product, available: ' + shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0), HttpStatus.BAD_REQUEST);
                }
                existingCartItem.quantity = quantity;
                await this.cartItemRepository.update(existingCartItem._id, existingCartItem, session);
            } else {
                const newCartItem = {
                    cartId: existingActiveCart.cart._id,
                    productId: new Types.ObjectId(productId),
                    quantity: 1,
                };
                await this.cartItemRepository.create(newCartItem, session);
            }

            await session.commitTransaction();
            return { message: 'Cart items added successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException("Add cart item error: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async updateCartItemQuantity(
        accountId: Types.ObjectId,
        cartItemId: string,
        quantity: number
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.accountsService.getExistAccountById(accountId);

            const cartItem = await this.getExistCartItemById(cartItemId);

            const product = await this.productsService.getExistProductById(cartItem.productId);
            const shipmentProducts = (await this.shipmentProductRepository.findByProductId(cartItem.productId)).filter(sp => sp.isDeactivated === false && sp.shipmentId && (sp.shipmentId as any).isDeleted === false);
            if (product.isDeactivated === true || shipmentProducts.length === 0 || shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0) < 1) {
                throw new HttpException('Product is not available', HttpStatus.BAD_REQUEST);
            }
            if (quantity < 1) {
                throw new HttpException('Quantity must be at least 1', HttpStatus.BAD_REQUEST);
            }

            if (quantity > shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0)) {
                throw new HttpException('Not enough stock for product, available: ' + shipmentProducts.reduce((acc, sp) => acc + sp.quantity, 0), HttpStatus.BAD_REQUEST);
            }

            cartItem.quantity = quantity;
            await this.cartItemRepository.update(cartItem._id, cartItem, session);

            await session.commitTransaction();
            return { message: 'Cart item quantity updated successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException("Update cart item quantity error: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }


    async deleteCartItem(
        accountId: Types.ObjectId,
        cartItemId: string
    ): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.accountsService.getExistAccountById(accountId);

            const cartItem = await this.getExistCartItemById(cartItemId);

            await this.cartItemRepository.delete(cartItem._id, session);

            await session.commitTransaction();
            return { message: 'Cart item deleted successfully' };
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException("Delete cart item error: " + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

}
