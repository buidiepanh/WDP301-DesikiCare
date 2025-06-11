import axios from "../util/axios.customize";

export const loginFunction = async (email, password) => {
  try {
    const login = await axios.post("/Account/login", {
      loginInfo: {
        email,
        password,
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
    return cart.data.cartItems;
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
