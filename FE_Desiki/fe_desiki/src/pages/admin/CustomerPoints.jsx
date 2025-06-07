import React from "react";
import styles from "./Admin.module.css";

const data = [
  { id: 1, name: "Nguyễn Văn C", points: "500 điểm" },
  { id: 2, name: "Trần Thị D", points: "750 điểm" },
];

const CustomerPoints = () => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Cấu hình điểm khách hàng</h2>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Điểm tích lũy</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.name}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPoints;
