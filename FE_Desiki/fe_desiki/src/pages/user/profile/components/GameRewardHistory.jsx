import React, { useState, useEffect } from "react";
import { Table, Typography, message } from "antd";
import { getPointHistory } from "../../../../services/apiServices";
import dayjs from "dayjs";

const { Title } = Typography;

const GameRewardHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await getPointHistory();
      const formatted = res.gameEventRewardResults.map(item => ({
        key: item.id,
        createdAt: item.gameEventRewardResult?.createdAt,
        points: item.gameEventRewardResult?.points,
        gameEvent: item.gameEvent,
      }));
      setHistory(formatted);
    } catch {
      message.error("Không thể tải lịch sử điểm.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "Thời gian nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: v => dayjs(v).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Số điểm nhận",
      dataIndex: "points",
      key: "points",
      render: pts => <span style={{ color: "#2e7d32", fontWeight: "bold" }}>{pts} điểm</span>,
    },
    {
      title: "Tên game",
      key: "gameName",
      render: (_, rec) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{rec.gameEvent?.gameName}</div>
          <div style={{ color: "#888", fontSize: 12 }}>{rec.gameEvent?.eventName}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="profile-section">
      <Title level={4}>Lịch sử nhận điểm Minigame</Title>
      <Table dataSource={history} columns={columns} pagination={{ pageSize: 5 }} size="middle" bordered locale={{ emptyText: "Chưa có lịch sử nhận điểm." }} />
    </div>
  );
};

export default GameRewardHistory;
