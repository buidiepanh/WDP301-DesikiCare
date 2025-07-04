import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, model, Model } from 'mongoose';
import 'reflect-metadata';
import { Account, AccountModel, AccountSchema } from './database/schemas/account/account.schema';
import { Role, RoleModel, RoleSchema } from './database/schemas/role/role.schema';
import { Cart, CartModel, CartSchema } from './database/schemas/cart/cart.schema';
import { CartItem, CartItemModel, CartItemSchema } from './database/schemas/cartItem/cartItem.schema';
import { Product, ProductModel, ProductSchema } from './database/schemas/product/product.schema';
import { ProductSkinType, ProductSkinTypeModel, ProductSkinTypeSchema } from './database/schemas/productSkinType/productSkinType.schema';
import { ProductSkinStatus, ProductSkinStatusModel, ProductSkinStatusSchema } from './database/schemas/productSkinStatus/productSkinStatus.schema';
import { Category, CategoryModel, CategorySchema } from './database/schemas/category/category.schema';
import { SkinType, SkinTypeModel, SkinTypeSchema } from './database/schemas/skinType/skinType.schema';
import { SkinStatus, SkinStatusModel, SkinStatusSchema } from './database/schemas/skinStatus/skinStatus.schema';
import { Order, OrderModel, OrderSchema } from './database/schemas/order/order.schema';
import { OrderStatus, OrderStatusModel, OrderStatusSchema } from './database/schemas/orderStatus/orderStatus.schema';
import { OrderItem, OrderItemModel, OrderItemSchema } from './database/schemas/orderItem/orderItem.schema';
import { DeliveryAddress, DeliveryAddressModel, DeliveryAddressSchema } from './database/schemas/deliveryAddress/deliveryAddress.schema';
import { GameEvent, GameEventModel, GameEventSchema } from './database/schemas/gameEvent/gameEvent.schema';
import { GameType, GameTypeModel, GameTypeSchema } from './database/schemas/gameType/gameType.schema';
import { GameEventRewardResult, GameEventRewardResultModel, GameEventRewardResultSchema } from './database/schemas/gameEventRewardResult/gameEventRewardResult.schema';
import { PaymentStatus, PaymentStatusModel, PaymentStatusSchema } from './database/schemas/paymentStatus/paymentStatus.schema';
import { Payment, PaymentModel, PaymentSchema } from './database/schemas/payment/payment.schema';
import { Shipment, ShipmentModel, ShipmentSchema } from './database/schemas/shipment/shipment.schema';
import { ShipmentProduct, ShipmentProductModel, ShipmentProductSchema } from './database/schemas/shipmentProduct/shipmentProduct.schema';
import { ChatbotConfig, ChatbotConfigModel, ChatbotConfigSchema } from './database/schemas/chatbotConfig/chatbotConfig.schema';

type migrateSchemaType = [
  Model<any>,
  any
]

@Injectable()
export class AppMigration implements OnApplicationBootstrap {
  constructor(
    @InjectConnection() private readonly connection: Connection,

    @InjectModel(Account.name) private readonly accountModel: AccountModel,
    @InjectModel(Role.name) private readonly roleModel: RoleModel,
    @InjectModel(Cart.name) private readonly cartModel: CartModel,
    @InjectModel(CartItem.name) private readonly cartItemModel: CartItemModel,
    @InjectModel(Product.name) private readonly productModel: ProductModel,
    @InjectModel(ProductSkinType.name) private readonly productSkinTypeModel: ProductSkinTypeModel,
    @InjectModel(ProductSkinStatus.name) private readonly productSkinStatusModel: ProductSkinStatusModel,
    @InjectModel(Category.name) private readonly categoryModel: CategoryModel,
    @InjectModel(SkinType.name) private readonly skinTypeModel: SkinTypeModel,
    @InjectModel(SkinStatus.name) private readonly skinStatusModel: SkinStatusModel,
    @InjectModel(Order.name) private readonly orderModel: OrderModel,
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: OrderStatusModel,
    @InjectModel(OrderItem.name) private readonly orderItemModel: OrderItemModel,
    @InjectModel(DeliveryAddress.name) private readonly deliveryAddressModel: DeliveryAddressModel,
    @InjectModel(GameEvent.name) private readonly gameEventModel: GameEventModel,
    @InjectModel(GameType.name) private readonly gameTypeModel: GameTypeModel,
    @InjectModel(GameEventRewardResult.name) private readonly gameEventRewardResultModel: GameEventRewardResultModel,
    @InjectModel(PaymentStatus.name) private readonly paymentStatusModel: PaymentStatusModel,
    @InjectModel(Payment.name) private readonly paymentModel: PaymentModel,
    @InjectModel(Shipment.name) private readonly shipmentModel: ShipmentModel,
    @InjectModel(ShipmentProduct.name) private readonly shipmentProductModel: ShipmentProductModel,
    @InjectModel(ChatbotConfig.name) private readonly chatbotConfigModel: ChatbotConfigModel,
  ) { }

  async onApplicationBootstrap() {
    console.log('---------------Running Migrations---------------');

    const migrateSchemas: migrateSchemaType[] = [
      [this.accountModel, AccountSchema.obj],
      [this.roleModel, RoleSchema.obj],
      [this.cartModel, CartSchema.obj],
      [this.cartItemModel, CartItemSchema.obj],
      [this.shipmentModel, ShipmentSchema.obj],
      [this.shipmentProductModel, ShipmentProductSchema.obj],
      [this.productModel, ProductSchema.obj],
      [this.productSkinTypeModel, ProductSkinTypeSchema.obj],
      [this.productSkinStatusModel, ProductSkinStatusSchema.obj],
      [this.categoryModel, CategorySchema.obj],
      [this.skinTypeModel, SkinTypeSchema.obj],
      [this.skinStatusModel, SkinStatusSchema.obj],
      [this.orderModel, OrderSchema.obj],
      [this.orderStatusModel, OrderStatusSchema.obj],
      [this.orderItemModel, OrderItemSchema.obj],
      [this.deliveryAddressModel, DeliveryAddressSchema.obj],
      [this.gameEventModel, GameEventSchema.obj],
      [this.gameTypeModel, GameTypeSchema.obj],
      [this.gameEventRewardResultModel, GameEventRewardResultSchema.obj],
      [this.paymentStatusModel, PaymentStatusSchema.obj],
      [this.paymentModel, PaymentSchema.obj],
      [this.chatbotConfigModel, ChatbotConfigSchema.obj],
    ]
    await this.execute_migration(migrateSchemas);

  }

  private async execute_migration(migrateSchemas: migrateSchemaType[]) {
    for (let i = 0; i < migrateSchemas.length; i++) {
      const [model, schema] = migrateSchemas[i];

      // xoá tất cả index của model
      await model.collection.dropIndexes();

      await this.ensureCollectionExisting(model);

      await this.ensureCollectionFields(model, schema);

      await this.ensureCollectionIndexes(model, schema);
    }
  }

  private async ensureCollectionExisting(model: Model<any>) {
    console.log(`\n[*] Ensuring existence for "${model.collection.name}" collection...`); 

    const existingCollections = await this.connection.db.listCollections().toArray();

    const collectionExists = existingCollections.some((col) => col.name === model.collection.name);
    if (!collectionExists) {
      console.log(`===> Creating "${model.collection.name}" collection...`);
      await model.createCollection();
    }
  }
  private async ensureCollectionFields(model: Model<any>, schema: any) {
    console.log(`\n[*] Ensuring feilds for "${model.collection.name}" collection...`);

    const expectedFields: any[] = this.getPropertyTypes(schema)
    const mongoDBDefaultFields = ['_id', 'createdAt', 'updatedAt', '__v'];


    const currentFieldArray = await model.db.db.collection(model.collection.name).find();

    for await (const currentFields of currentFieldArray) {
      if (currentFields) {
        const fieldsToAdd = {};
        const fieldsToRemove = {}

        const missingFields = expectedFields.filter((field) => !(field.property in currentFields) && !mongoDBDefaultFields.includes(field.property)); 


        const redundantFields = Object.keys(currentFields).filter((field) => !expectedFields.some((expectedField) => expectedField.property === field) && !mongoDBDefaultFields.includes(field));

        missingFields.forEach((field) => {
          fieldsToAdd[field.property] = null;  
        });

        redundantFields.forEach((field) => {
          fieldsToRemove[field] = '';
        });

        if (missingFields.length > 0) {
          console.log(`===> Creating fields: `, fieldsToAdd);



          await model.db.db.collection(model.collection.name).updateOne(
            { _id: currentFields._id },
            { $set: fieldsToAdd }
          );
        }
        if (redundantFields.length > 0) {
          console.log(`===> Removing fields: `, fieldsToRemove);
          await model.db.db.collection(model.collection.name).updateOne(
            { _id: currentFields._id },
            { $unset: fieldsToRemove }
          );
        }
      }
    }


  }
  private async ensureCollectionIndexes(model: Model<any>, schema: any) {
    console.log(`\n[*] Ensuring indexes for "${model.collection.name}" collection...`);
    try {
      model.syncIndexes();
    } catch (error) {
      console.error(`===> Error syncing indexes for ${schema.name}:`, error);
    }
  }



  getPropertyTypes(target: any): any[] {

    const propertyTypes = Object.keys(target)
      .filter((key) => key !== 'constructor')
      .map((key) => ({
        property: key,
        type: target[key].type.name,
      }));
    return propertyTypes;
  }


}
