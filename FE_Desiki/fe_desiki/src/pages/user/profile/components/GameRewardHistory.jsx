import React from "react";
import { Table } from "antd";

const GameRewardHistory = ({ rewards }) => {
  return (
    <>
      <h4>Lịch sử nhận thưởng</h4>
      <Table
        dataSource={rewards || []}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: "Tên sự kiện",
            dataIndex: "eventName",
          },
          {
            title: "Phần thưởng",
            dataIndex: "reward",
          },
          {
            title: "Ngày nhận",
            dataIndex: "dateReceived",
          },
        ]}
      />
    </>
  );
};

export default GameRewardHistory;