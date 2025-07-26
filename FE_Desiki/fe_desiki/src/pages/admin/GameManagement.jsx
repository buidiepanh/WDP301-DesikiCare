import React from "react";
import styles from "./Admin.module.css";

const events = [
  { id: 1, name: "Sự kiện Tết", status: "Đang diễn ra", reward: "10 điểm/ngày" },
  { id: 2, name: "Black Friday", status: "Đã kết thúc", reward: "20 điểm/ngày" },
];

const GameManagement = () => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Quản lý sự kiện game</h2>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sự kiện</th>
              <th>Trạng thái</th>
              <th>Điểm thưởng</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.status}</td>
                <td>{e.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameManagement;
