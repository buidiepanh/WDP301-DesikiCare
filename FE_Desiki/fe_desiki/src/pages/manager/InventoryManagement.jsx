import React from "react";
import styles from "./ManagerPages.module.css";

const InventoryManagement = () => {
  const data = [
    ["1", "Toner hoa hồng", "120"],
    ["2", "Mặt nạ ngủ", "45"],
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý kho</h2>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Số lượng tồn</th>
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

export default InventoryManagement;
