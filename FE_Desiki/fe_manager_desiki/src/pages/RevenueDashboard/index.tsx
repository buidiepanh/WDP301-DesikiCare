"use client";

import type React from "react";

import { dashboardData } from "@/data/dashboardMockData";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const categoriesData = [
  { _id: 1, name: "Sữa Rửa Mặt" },
  { _id: 2, name: "Kem Dưỡng" },
  { _id: 3, name: "Toner" },
  { _id: 4, name: "Serum" },
  { _id: 5, name: "Kem Chống Nắng" },
  { _id: 6, name: "Tẩy Tế Bào Chết" },
  { _id: 7, name: "Mặt Nạ" },
];

type PreparedDashboardData = {
  totalRevenue: number;
  amount: number;
  revenueByCategories: {
    categoryId: number;
    categoryName: string;
    amount: number;
    revenue: number;
  }[];
  bestCustomer: {
    customerId: string;
    fullName: string;
    count: number;
    totalAmount: number;
  };
  bestProduct: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  chartData: ChartData;
};

type ChartData = {
  startDate: string | null;
  endDate: string | null;
  chartData: { title: string; amount: number; revenue: number }[];
};

// Chart configuration for glassmorphism theme
const chartConfig = {
  revenue: {
    label: "Lợi nhuận",
    color: "rgba(59, 130, 246, 0.8)", // Blue with transparency
  },
  amount: {
    label: "Số lượng",
    color: "rgba(16, 185, 129, 0.8)", // Green with transparency
  },
} satisfies ChartConfig;

// Custom Glassmorphism Card Component
const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    style={{ backdropFilter: "blur(16px)" }}
  >
    {children}
  </div>
);

const RevenueDashboard = () => {
  // STATES
  const [viewMode, setViewMode] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [preparedData, setPreparedData] =
    useState<PreparedDashboardData | null>(null);

  // HOOKS
  useEffect(() => {
    setIsLoading(true);
    handleViewModeChange("today");
  }, []);

  // FUNCTIONS
  const handleViewModeChange = async (mode: string) => {
    setIsLoading(true);
    setViewMode(mode);
    try {
      const today = new Date();
      if (mode === "today") {
        const todayStr = today.toISOString().split("T")[0];
        const response = dashboardData.filter((item) => {
          const createdAtDate = item.order.createdAt.split("T")[0];
          return createdAtDate === todayStr;
        });
        await prepareData(response, todayStr, null, mode);
      } else if (mode === "week") {
        const currentDay = (today.getDay() + 6) % 7;
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - currentDay);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);

        const response = dashboardData.filter((item) => {
          const createdAt = new Date(item.order.createdAt);
          return createdAt >= firstDayOfWeek && createdAt <= lastDayOfWeek;
        });

        const { from, to } = getDateRangeFromData(response);
        await prepareData(response, from, to, mode);
      } else if (mode === "month") {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const response = dashboardData.filter((item) => {
          const createdAt = new Date(item.order.createdAt);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        });

        const { from, to } = getDateRangeFromData(response);
        await prepareData(response, from, to, mode);
      } else if (mode === "year") {
        const currentYear = today.getFullYear();

        const response = dashboardData.filter((item) => {
          const createdAt = new Date(item.order.createdAt);
          return createdAt.getFullYear() === currentYear;
        });

        const { from, to } = getDateRangeFromData(response);
        await prepareData(response, from, to, mode);
      }
    } catch (error) {
      console.log("Error while fetching dashboard: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRangeFromData = (data: any[]) => {
    const dates = data.map((d) => new Date(d.order.createdAt));
    const from = dates.reduce((a, b) => (a < b ? a : b)).toISOString();
    const to = dates.reduce((a, b) => (a > b ? a : b)).toISOString();
    return { from, to };
  };

  const prepareData = async (
    data: any[],
    from: string | null,
    to: string | null,
    mode: string
  ) => {
    const totalRevenue = data.reduce((acc, order) => {
      const orderProfit = order.orderItems.reduce(
        (orderAcc: number, item: any) => {
          const quantity = item.orderItem.quantity;
          const unitPrice = item.orderItem.unitPrice;
          const buyPrice = item.shipmentProduct.buyPrice;
          return orderAcc + (unitPrice - buyPrice) * quantity;
        },
        0
      );
      return acc + orderProfit;
    }, 0);

    const amount = data.length;
    const revenueMap = new Map<number, { amount: number; revenue: number }>();
    const customerMap = new Map<
      string,
      { count: number; totalAmount: number }
    >();
    const productMap = new Map<
      string,
      { product: any; totalQuantity: number }
    >();

    for (const orderEntry of data) {
      const { order, orderItems } = orderEntry;

      const customer = customerMap.get(order.accountId) || {
        count: 0,
        totalAmount: 0,
      };
      customer.count += 1;
      customer.totalAmount += order.totalPrice;
      customerMap.set(order.accountId, customer);

      for (const item of orderItems) {
        const { product, orderItem, shipmentProduct } = item;
        const profit =
          (orderItem.unitPrice - shipmentProduct.buyPrice) * orderItem.quantity;

        const cat = revenueMap.get(product.categoryId) || {
          amount: 0,
          revenue: 0,
        };
        cat.amount += orderItem.quantity;
        cat.revenue += profit;
        revenueMap.set(product.categoryId, cat);

        const prod = productMap.get(product._id) || {
          product,
          totalQuantity: 0,
        };
        prod.totalQuantity += orderItem.quantity;
        productMap.set(product._id, prod);
      }
    }

    const revenueByCategories = Array.from(revenueMap.entries()).map(
      ([categoryId, val]) => {
        const categoryName =
          categoriesData.find((c) => c._id === categoryId)?.name || "Unknown";
        return {
          categoryId,
          categoryName,
          amount: val.amount,
          revenue: val.revenue,
        };
      }
    );

    const bestCustomerEntry = Array.from(customerMap.entries()).sort(
      (a, b) => b[1].totalAmount - a[1].totalAmount
    )[0];

    const bestCustomer = {
      customerId: bestCustomerEntry?.[0] || "",
      fullName: "Khách Hàng A",
      count: bestCustomerEntry?.[1].count || 0,
      totalAmount: bestCustomerEntry?.[1].totalAmount || 0,
    };

    const bestProductEntry = Array.from(productMap.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    )[0];

    const bestProduct = bestProductEntry?.product || null;

    const chartData = generateChartData(data, mode);

    setPreparedData({
      totalRevenue,
      amount: amount,
      revenueByCategories,
      bestCustomer,
      bestProduct,
      chartData: {
        startDate: from,
        endDate: to,
        chartData,
      },
    });

    console.log("Total Revenue: ", totalRevenue);
    console.log("RevenueByCategories: ", revenueByCategories);
    console.log("Best Customer: ", bestCustomer);
    console.log("Best Products: ", bestProduct);
    console.log("ChartData: ", chartData);
  };

  const generateChartData = (data: any[], mode: string) => {
    let chartLabels: { title: string; match: (date: Date) => boolean }[] = [];

    if (mode === "today") {
      chartLabels = [
        { title: "00:00 - 04:00", match: (d) => d.getHours() < 4 },
        {
          title: "04:00 - 08:00",
          match: (d) => d.getHours() >= 4 && d.getHours() < 8,
        },
        {
          title: "08:00 - 12:00",
          match: (d) => d.getHours() >= 8 && d.getHours() < 12,
        },
        {
          title: "12:00 - 16:00",
          match: (d) => d.getHours() >= 12 && d.getHours() < 16,
        },
        {
          title: "16:00 - 20:00",
          match: (d) => d.getHours() >= 16 && d.getHours() < 20,
        },
        { title: "20:00 - 24:00", match: (d) => d.getHours() >= 20 },
      ];
    } else if (mode === "week") {
      chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (d, i) => ({
          title: d,
          match: (date) => (date.getDay() + 6) % 7 === i,
        })
      );
    } else if (mode === "month") {
      chartLabels = [0, 1, 2, 3].map((i) => ({
        title: `Week ${i + 1}`,
        match: (date) => Math.floor((date.getDate() - 1) / 7) === i,
      }));
    } else if (mode === "year") {
      chartLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month, i) => ({
        title: month,
        match: (date) => date.getMonth() === i,
      }));
    }

    return chartLabels.map(({ title, match }) => {
      let amount = 0;
      let revenue = 0;

      data.forEach((entry) => {
        entry.orderItems.forEach((item: any) => {
          const date = new Date(item.orderItem.createdAt);
          if (match(date)) {
            const quantity = item.orderItem.quantity;
            const unitPrice = item.orderItem.unitPrice;
            const buyPrice = item.shipmentProduct.buyPrice;
            amount += quantity;
            revenue += (unitPrice - buyPrice) * quantity;
          }
        });
      });

      return { title, amount, revenue };
    });
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case "today":
        return "hôm nay";
      case "week":
        return "tuần này";
      case "month":
        return "tháng này";
      case "year":
        return "năm này";
      default:
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header Section */}
      <GlassCard className="mb-8 p-6">
        <h1 className="text-white text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-white/70 text-lg">Trang thống kê của công ty.</p>
      </GlassCard>

      {/* View Mode Buttons */}
      <div className="w-full mb-8 flex items-center justify-end gap-4">
        {["today", "week", "month", "year"].map((mode) => (
          <button
            key={mode}
            onClick={() => handleViewModeChange(mode)}
            className={`px-6 py-3 ${
              viewMode === mode ? "bg-yellow-300/50" : "bg-blue-200/20"
            } border border-blue-400/40 text-white rounded-xl hover:bg-yellow-300/50 transition-all duration-200 backdrop-blur-sm font-medium shadow-lg`}
          >
            {mode === "today" && "Hôm nay"}
            {mode === "week" && "Tuần"}
            {mode === "month" && "Tháng"}
            {mode === "year" && "Năm"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <GlassCard className="flex flex-col justify-center items-center gap-2 p-6 h-[500px]">
          <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
          <p className="text-white/70 text-lg">Đang Tải Dữ Liệu ...</p>
        </GlassCard>
      ) : (
        <div className="mb-8 w-full flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6 flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <p className="text-white/70 text-md font-bold">
                  Tổng Doanh Thu
                </p>
              </div>
              <p className="text-white text-2xl font-bold">
                {preparedData?.totalRevenue.toLocaleString("vi-VN")}đ
              </p>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-400" />
                <p className="text-white/70 text-md font-bold">Tổng Đơn Hàng</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {preparedData?.amount} Orders
              </p>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <p className="text-white/70 text-md font-bold">Bán Chạy Nhất</p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={preparedData?.bestProduct.imageUrl || "/placeholder.svg"}
                  alt="best_product"
                  className="w-[50px] h-[50px] rounded-lg border border-white/20"
                />
                <p className="text-white/70 text-md">
                  {preparedData?.bestProduct.name}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <p className="text-white/70 text-md font-bold">
                  Khách hàng VIP
                </p>
              </div>
              <p className="text-white text-2xl font-bold">
                {preparedData?.bestCustomer.fullName}
              </p>
            </GlassCard>
          </div>

          {/* Revenue Chart */}
          <GlassCard className="p-0 overflow-hidden">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Biểu đồ lợi nhuận {getViewModeLabel()}
                </CardTitle>
                <CardDescription className="text-white/70">
                  Hiển thị lợi nhuận theo thời gian được chọn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={preparedData?.chartData.chartData || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="title"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "rgba(255, 255, 255, 0.8)", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "rgba(255, 255, 255, 0.8)", fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <ChartTooltip
                      cursor={{
                        fill: "rgba(255, 255, 255, 0.15)",
                        stroke: "rgba(255, 255, 255, 0.3)",
                        strokeWidth: 1,
                        rx: 4,
                        ry: 4,
                      }}
                      content={
                        <ChartTooltipContent
                          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-lg shadow-2xl text-white"
                          labelClassName="text-white font-medium"
                          formatter={(value, name) => [
                            `${Number(value).toLocaleString("vi-VN")}${
                              name === "revenue" ? "đ" : ""
                            }`,
                            name === "revenue" ? "Lợi nhuận" : "Số lượng",
                          ]}
                          style={{
                            backdropFilter: "blur(16px)",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.8}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none text-white">
                      Dữ liệu lợi nhuận {getViewModeLabel()}
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 leading-none text-white/70">
                      {preparedData?.chartData.startDate &&
                      preparedData?.chartData.endDate
                        ? `${new Date(
                            preparedData.chartData.startDate
                          ).toLocaleDateString("vi-VN")} - ${new Date(
                            preparedData.chartData.endDate
                          ).toLocaleDateString("vi-VN")}`
                        : "Dữ liệu thời gian thực"}
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default RevenueDashboard;
