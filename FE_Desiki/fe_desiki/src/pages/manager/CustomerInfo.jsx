import React from "react";
import styles from "./ManagerPages.module.css";

const CustomerInfo = () => {
  const data = [
    ["1", "Lê Minh Tuấn", "tuanle@gmail.com", "420", "Hoạt động"],
    ["2", "Trần Mỹ Linh", "linhtran@gmail.com", "95", "Khóa"],
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thông tin khách hàng</h2>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điểm tích lũy</th>
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

export default CustomerInfo;
