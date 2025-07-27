// PRODUCT MANAGEMENT
export type ProductAPI = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  category: Category;
  shipmentProducts: any[] | null;
  productSkinTypes: SkinType[];
  productSkinStatuses: SkinStatus[];
};

export type SkinType = {
  _id: number;
  name: string;
};

export type SkinStatus = {
  _id: number;
  name: string;
};

export type Category = {
  _id: number;
  name: string;
};

// SHIPMENT MANAGEMENT
export type ShipmentProduct = {
  shipment: {
    _id: string;
    shipmentDate: string;
    createdAt: string;
    updatedAt: string;
  };
  shipmentProduct: {
    _id: string;
    productId: string;
    shipmentId: string;
    quantity: number;
    manufacturingDate: string;
    expiryDate: string;
    buyPrice: number;
    createdAt: string;
    updatedAt: string;
  };
  category: Category;
};

export type ShipmentProductDetails = {
  shipmentProduct: {
    _id: string;
    productId: string;
    shipmentId: string;
    quantity: number;
    manufacturingDate: string;
    expiryDate: string;
    buyPrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
  };
  shipment: {
    _id: string;
    shipmentDate: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  product: {
    _id: string;
    name: string;
    description: string;
    categoryId: number;
    volume: number;
    salePrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
};

export type ShipmentType = {
  shipment: {
    _id: string;
    shipmentDate: string;
    isDeleted: boolean;
    createdAt: string;
    updateAt: string;
  };
  shipmentProducts: ShipmentProduct[];
};

// ORDER MANAGEMENT
export type OrderItem = {
  orderItem: {
    _id: string;
    orderId: string;
    shipmentProductId: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
  };
  shipmentProduct: {
    _id: string;
    productId: string;
    shipmentId: string;
    quantity: number;
    manufacturingDate: string;
    expiryDate: string;
    buyPrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
  };
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
};

export type Order = {
  order: {
    _id: string;
    accountId: string;
    deliveryAddressId: string;
    pointUsed: number;
    totalPrice: number;
    orderStatusId: number;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
  };
  orderStatus: {
    _id: number;
    name: string;
  };
  orderItems: OrderItem[];
};

// MINI GAMES CONFIG
export type GameType = {
  _id: number;
  name: string;
};

export type GameTypeImgUrl = {
  id: number;
  imageUrl: string;
};

export type GameConfigJson = {
  [key: string]: any;
};

export type GameEventRewardResult = {
  gameEventRewardResult: {
    _id: string;
    gameEventId: string;
    accountId: string;
    points: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type GameEvent = {
  gameEvent: {
    _id: string;
    eventName: string;
    description: string;
    gameName: string;
    gameTypeId: number;
    configJson: GameConfigJson;
    startDate: string;
    endDate: string;
    balancePoints: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  gameTypesImgUrls: GameTypeImgUrl[] | null;
  gameEventRewardResults: GameEventRewardResult[];
};

export type CreateGame = {
  gameEvent: {
    eventName: string;
    description: string;
    gameName: string;
    gameTypeId: number;
    configJson: GameConfigJson;
    startDate: string;
    endDate: string;
    balancePoints: number;
    imageBase64: string;
  };
  gameTypeImageBase64s: { id: number; imageBase64: string }[];
};

export type GameTypeImageBase64 = {
  id: number;
  imageBase64: string;
};
