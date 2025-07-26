import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { addNewOrder, getMe } from "../../../services/apiServices";

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("newOrderId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const isPaid = sessionStorage.getItem("isPaid") === "true";

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  const fetchAuthenticatedUser = async () => {
    try {
      const res = await getMe();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewOrder = async () => {
    try {
      const defaultAddress = user?.deliveryAddresses.find(
        (addr) => addr.isDefault
      );
      const res = await addNewOrder(orderId, 0, defaultAddress._id);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (searchParams.get("status") === "PAID") {
          if (isPaid) {
            toast.success("Thanh toán giỏ hàng thành công!");
            handleAddNewOrder();
            sessionStorage.removeItem("isPaid");
            navigate("/");
          } else {
            toast.success("Thanh toán đơn hàng thành công!");
            navigate("/");
          }
        } else {
          toast.error("Thanh toán thất bại!");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      confirmPayment();
    }
  }, [user]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}

export default PaymentReturn;
