import axios from "../util/axios.customize";
import axiosRaw from "../util/axios.raw";

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

export const addNewOrder = async (orderId, point, address) => {
  try {
    const result = await axios.post("/Order/orders", {
      order: {
        newOrderId: orderId,
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
        returnUrl: "http://localhost:5173/payment-return",
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentUrlForOrder = async (orderId) => {
  try {
    const res = await axios.post(`/Order/orders/${orderId}/getPaymentLink`, {
      cancelUrl: "http://localhost:5173/profile",
      returnUrl: "http://localhost:5173/payment-return",
    });
    return res.data;
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
    if (result && result.status === 200) {
      return result.data.gameEvents;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const joinTheGameEvent = async (gameEventId) => {
  try {
    const result = await axios.post(`/Game/gameEvents/${gameEventId}/join`);
    if (result && (result.status === 200 || result.status === 201)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error joining game event:", error);
  }
};

export const getGameEventDetails = async (gameEventId) => {
  try {
    const result = await axios.get(`/Game/gameEvents/${gameEventId}`);
    if (result && result.status === 200) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error fetching game event details:", error);
  }
};

export const finishGameEvent = async (gameEventId, points) => {
  try {
    const result = await axios.post(`/Game/gameEventsRewards`, {
      gameEventReward: {
        gameEventId: gameEventId,
        points: points,
      },
    });
    if (result && (result.status === 200 || result.status === 201)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error finishing game event:", error);
  }
};

export const updateGamePoints = async (gameEventId, points) => {
  try {
    // Thay thế bằng API endpoint thực tế của bạn
    const result = axios.post("/Game/gameEventsRewards", {
      gameEventReward: {
        gameEventId: gameEventId,
        points: points,
      },
    });
    if (result && result.status === 200) {
      return true;
    } else {
      throw new Error("Failed to update points");
    }
  } catch (error) {
    console.error("Error updating game points:", error);
    throw error;
  }
};

export const getPointHistory = async () => {
  try {
    const res = await axios.get("/Game/gameEventsRewards/me");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProvince = async () => {
  try {
    const res = await axiosRaw.get(
      "https://provinces.open-api.vn/api/?depth=3"
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// COMMIT - DIEP ANH
export const getQuiz = async () => {
  try {
    const res = await axios.get("/Quiz");
    return res.data.quizQuestions;
  } catch (error) {
    console.log(error);
  }
};

// COMMIT - DIEP ANH
export const submitQuiz = async (quizOptionIds) => {
  try {
    const res = await axios.post("/Quiz/result", {
      quizOptionIds: quizOptionIds,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
