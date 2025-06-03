import React, { useState } from "react";
import styles from "./Statistics.module.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, ResponsiveContainer,
} from "recharts";

import dayjs from "dayjs";

const Statistics = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const summaryCards = [
    { label: "Doanh thu hôm nay", value: "3.200.000₫" },
    { label: "Tổng đơn hàng", value: "48" },
    { label: "Đơn đã giao", value: "35" },
    { label: "Đơn huỷ", value: "2" },
    { label: "Khách hàng mới", value: "7" },
    { label: "Lượt truy cập", value: "1.245" },
  ];

  const revenueByDay = [
    { day: "Thứ 2", revenue: 2100000 },
    { day: "Thứ 3", revenue: 3200000 },
    { day: "Thứ 4", revenue: 2800000 },
    { day: "Thứ 5", revenue: 3500000 },
    { day: "Thứ 6", revenue: 3000000 },
    { day: "Thứ 7", revenue: 4200000 },
    { day: "Chủ Nhật", revenue: 2600000 },
  ];

  const orderStatusRatio = [
    { status: "Đã giao", value: 35 },
    { status: "Chờ xác nhận", value: 8 },
    { status: "Đang giao", value: 3 },
    { status: "Đơn huỷ", value: 2 },
  ];

  const productSales = [
    { product: "Serum Vitamin C", sold: 120 },
    { product: "Sữa rửa mặt", sold: 80 },
    { product: "Toner hoa hồng", sold: 95 },
    { product: "Kem chống nắng", sold: 110 },
  ];

  const pieColors = ["#00C49F", "#FFBB28", "#FF8042", "#e91e63"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thống kê doanh thu & đơn hàng</h2>

      {/* Bộ lọc ngày/tháng */}
      <div className={styles.filters}>
        <label>
          Ngày:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Tháng:
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {summaryCards.map((card, index) => (
          <div key={index} className={styles.card}>
            <h4>{card.label}</h4>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsWrapper}>
        {/* Line Chart */}
        <div className={styles.chartBox}>
          <h4>Doanh thu theo ngày</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueByDay}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ec407a" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className={styles.chartBox}>
          <h4>Tỷ lệ đơn hàng</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusRatio}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderStatusRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartBox}>
          <h4>Sản phẩm bán chạy</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
