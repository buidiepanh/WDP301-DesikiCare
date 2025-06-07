import React from "react";
import styles from "./Admin.module.css";

const templates = [
  { id: 1, template: "Hỏi giờ làm việc", answer: "Shop mở cửa từ 8h đến 20h" },
  { id: 2, template: "Đổi trả sản phẩm", answer: "Đổi trong 7 ngày nếu lỗi NSX" },
];

const ChatbotContent = () => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Cập nhật nội dung Chatbot</h2>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Câu hỏi mẫu</th>
              <th>Câu trả lời</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.template}</td>
                <td>{t.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatbotContent;
