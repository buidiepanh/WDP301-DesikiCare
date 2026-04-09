import { Account, AccountSchema } from "./schemas/account/account.schema";
import { Role, RoleSchema } from "./schemas/role/role.schema";
import { CartItem, CartItemSchema } from "./schemas/cartItem/cartItem.schema";
import { Product, ProductSchema } from "./schemas/product/product.schema";
import { ProductSkinType, ProductSkinTypeSchema } from "./schemas/productSkinType/productSkinType.schema";
import { Cart, CartSchema } from "./schemas/cart/cart.schema";
import { ProductSkinStatus, ProductSkinStatusSchema } from "./schemas/productSkinStatus/productSkinStatus.schema";
import { Category, CategorySchema } from "./schemas/category/category.schema";
import { SkinType, SkinTypeSchema } from "./schemas/skinType/skinType.schema";
import { SkinStatus, SkinStatusSchema } from "./schemas/skinStatus/skinStatus.schema";
import { Order, OrderSchema } from "./schemas/order/order.schema";
import { OrderStatus, OrderStatusSchema } from "./schemas/orderStatus/orderStatus.schema";
import { OrderItem, OrderItemSchema } from "./schemas/orderItem/orderItem.schema";
import { DeliveryAddress, DeliveryAddressSchema } from "./schemas/deliveryAddress/deliveryAddress.schema";
import { GameEvent, GameEventSchema } from "./schemas/gameEvent/gameEvent.schema";
import { GameType, GameTypeSchema } from "./schemas/gameType/gameType.schema";
import { GameEventRewardResult, GameEventRewardResultSchema } from "./schemas/gameEventRewardResult/gameEventRewardResult.schema";
import { PaymentStatus, PaymentStatusSchema } from "./schemas/paymentStatus/paymentStatus.schema";
import { Payment, PaymentSchema } from "./schemas/payment/payment.schema";
import { Shipment, ShipmentSchema } from "./schemas/shipment/shipment.schema";
import { ShipmentProduct, ShipmentProductSchema } from "./schemas/shipmentProduct/shipmentProduct.schema";
import { ChatbotConfig, ChatbotConfigSchema } from "./schemas/chatbotConfig/chatbotConfig.schema";
import { OrderPriceBaseGameTicketReward, OrderPriceBaseGameTicketRewardSchema } from "./schemas/orderPriceBaseGameTicketReward/orderPriceBaseGameTicketReward.schema";
import { QuizQuestion, QuizQuestionSchema } from "./schemas/quizQuestion/quizQuestion.schema";
import { QuizOption, QuizOptionSchema } from "./schemas/quizOption/quizOption.schema";
import { QuizOptionSkinType, QuizOptionSkinTypeSchema } from "./schemas/quizOptionSkinType/quizOptionSkinType.schema";
import { QuizOptionSkinStatus, QuizOptionSkinStatusSchema } from "./schemas/quizOptionSkinStatus/quizOptionSkinStatus.schema";

export const databaseFeatures = [
  //** name ở đây để sử dụng trong @InjectModel inject trong service/controller, @InjectModel(User.name) 
  { name: Account.name, schema: AccountSchema },
  { name: Role.name, schema: RoleSchema },
  { name: Cart.name, schema: CartSchema },
  { name: CartItem.name, schema: CartItemSchema },
  { name: Shipment.name, schema: ShipmentSchema },
  { name: ShipmentProduct.name, schema: ShipmentProductSchema },
  { name: Product.name, schema: ProductSchema },
  { name: ProductSkinType.name, schema: ProductSkinTypeSchema },
  { name: ProductSkinStatus.name, schema: ProductSkinStatusSchema },
  { name: Category.name, schema: CategorySchema },
  { name: SkinType.name, schema: SkinTypeSchema },
  { name: SkinStatus.name, schema: SkinStatusSchema },
  { name: Order.name, schema: OrderSchema },
  { name: OrderStatus.name, schema: OrderStatusSchema },
  { name: OrderItem.name, schema: OrderItemSchema },
  { name: DeliveryAddress.name, schema: DeliveryAddressSchema },
  { name: GameEvent.name, schema: GameEventSchema },
  { name: GameType.name, schema: GameTypeSchema },
  { name: GameEventRewardResult.name, schema: GameEventRewardResultSchema },
  { name: PaymentStatus.name, schema: PaymentStatusSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: ChatbotConfig.name, schema: ChatbotConfigSchema },
  { name: OrderPriceBaseGameTicketReward.name, schema: OrderPriceBaseGameTicketRewardSchema },
  { name: QuizQuestion.name, schema: QuizQuestionSchema },
  { name: QuizOption.name, schema: QuizOptionSchema },
  { name: QuizOptionSkinType.name, schema: QuizOptionSkinTypeSchema },
  { name: QuizOptionSkinStatus.name, schema: QuizOptionSkinStatusSchema },
  
]