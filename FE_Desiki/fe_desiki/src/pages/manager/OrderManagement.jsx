import React from "react";
import styles from "./OrderManagement.module.css";

const OrderManagement = () => {
  const data = [
    ["#OD001", "Nguyễn Văn A", "Chờ xác nhận"],
    ["#OD002", "Trần Thị B", "Đã giao"],
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý đơn hàng</h2>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {row.map((item, i) => (
                  <td key={i}>{item}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
