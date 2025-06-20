import axios from "../util/axios.customize";

export const loginFunction = async (mail, pass) => {
  try {
    const login = await axios.post("/Account/login", {
      loginInfo: {
        email: mail,
        password: pass,
      },
    });
    return login.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerFunction = async (payload) => {
  try {
    console.log(payload);
    const regis = await axios.post("/Account/register", payload);
    return regis.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = async () => {
  try {
    const result = await axios.get("/Product/products");
    return result.data.products;
  } catch (error) {
    console.log(error);
  }
};

export const getAuthenitcatedUserCart = async () => {
  try {
    const cart = await axios.get("/Order/carts/me");
    return cart.data;
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = async (id) => {
  try {
    const result = await axios.post("/Order/cartItems", { productId: id });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const changeQuantity = async (id, number) => {
  try {
    const result = await axios.put(`/Order/cartItems/${id}`, {
      quantity: number,
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCartItem = async (id) => {
  try {
    const result = await axios.delete(`Order/cartItems/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCategories = async () => {
  try {
    const result = await axios.get("/Product/categories");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSkinTypes = async () => {
  try {
    const result = await axios.get("/Product/skinTypes");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSkinStatuses = async () => {
  try {
    const result = await axios.get("/Product/skinStatuses");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async () => {
  const res = await axios.get("/Account/me");
  return res.data;
};

export const updateAccount = async (accountId, payload) => {
  const res = await axios.put(`/Account/accounts/${accountId}`, payload);
  return res.data;
};

export const changePassword = async (accountId, oldPassword, newPassword) => {
  try {
    const res = await axios.put(`/Account/accounts/${accountId}/password`, {
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Lỗi không xác định" };
  }
};

export const addAddress = async (accountId, payload) => {
  try {
    const res = await axios.post(
      `/Account/accounts/${accountId}/deliveryAddresses`,
      payload
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const setDefaultAddress = async (deliveryAddressId) => {
  const res = await axios.put(
    `/Account/deliveryAddresses/${deliveryAddressId}/set-default`
  );
  return res.data;
};

export const deleteAddress = async (deliveryAddressId) => {
  const res = await axios.delete(
    `/Account/deliveryAddresses/${deliveryAddressId}`
  );
  return res.data;
};

export const getAllOrders = async () => {
  const res = await axios.get("/Order/orders");
  return res.data.orders;
};

export const addNewOrder = async (point, address) => {
  try {
    const result = await axios.post("/Order/orders", {
      order: {
        pointUsed: point,
        deliveryAddressId: address,
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderDetail = async (orderId) => {
  const res = await axios.get(`/Order/orders/${orderId}`);
  return res.data;
};

export const getChatbotConfig = async () => {
  const res = await axios.get("/Chatbot/chatbotConfigs");
  return res.data;
};

export const getPaymentUrlForCart = async (point, address) => {
  try {
    const result = await axios.post("/Order/carts/getPaymentLink", {
      order: {
        pointUsed: point,
        deliveryAddressId: address,
      },
      metaData: {
        cancelUrl: `http://localhost:5173/cart`,
        returnUrl: "http://localhost:5173/cart",
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllMiniGames = async () => {
  try {
    const game = await axios.get("/Game/gameTypes");
    return game.data;
  } catch (error) {
    console.log(error);
  }
};

export const getGamesEvent = async () => {
  try {
    const result = await axios.get("/Game/gameEvents");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
