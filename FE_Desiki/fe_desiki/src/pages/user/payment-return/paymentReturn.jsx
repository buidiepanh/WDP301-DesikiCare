import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (searchParams.get("status") === "PAID") {
          toast.success("Thanh toán thành công!");
          navigate("/");
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

    confirmPayment();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}

export default PaymentReturn;
