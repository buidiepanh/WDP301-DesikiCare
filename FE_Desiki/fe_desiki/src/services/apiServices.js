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

export const getMe = async () => {
  const res = await axios.get("/Account/me");
  return res.data;
};

export const updateAccount = async (accountId, payload) => {
  const res = await axios.put(`/Account/accounts/${accountId}`, payload);
  return res.data;
};

export const addAddress = async (accountId, payload) => {
  const res = await axios.post(`/Account/accounts/${accountId}/deliveryAddresses`, payload);
  return res.data;
};

export const setDefaultAddress = async (deliveryAddressId) => {
  const res = await axios.put(`/Account/deliveryAddresses/${deliveryAddressId}/set-default`);
  return res.data;
};

export const deleteAddress = async (deliveryAddressId) => {
  const res = await axios.delete(`/Account/deliveryAddresses/${deliveryAddressId}`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await axios.get("/Order/orders");
  return res.data.orders || [];
};

export const getOrderDetail = async (orderId) => {
  const res = await axios.get(`/Order/orders/${orderId}`);
  return res.data;
};
