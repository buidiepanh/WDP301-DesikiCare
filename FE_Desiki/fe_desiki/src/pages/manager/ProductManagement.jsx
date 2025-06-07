import React from "react";
import styles from "./ProductManagement.module.css";

const ProductManagement = () => {
  const data = [
    ["1", "Kem dưỡng ẩm ban đêm", "Đang bán"],
    ["2", "Sữa rửa mặt sáng da", "Ngừng bán"],
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý sản phẩm</h2>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
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

export default ProductManagement;
