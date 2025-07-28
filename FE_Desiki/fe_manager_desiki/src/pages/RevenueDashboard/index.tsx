"use client";

import type React from "react";

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
import { callAPIAuth } from "@/api/axiosInstace";
import Swal from "sweetalert2";

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

  // HELPER FUNCTIONS
  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // FUNCTIONS

  const handleViewModeChange = async (mode: string) => {
    setIsLoading(true);
    setViewMode(mode);
    console.log(
      `\n🚀 === STARTING API CALL FOR MODE: ${mode.toUpperCase()} ===`
    );

    try {
      const today = new Date();

      if (mode === "today") {
        const todayStr = formatDateToDDMMYYYY(today);
        const payload = {
          startDate: todayStr,
          endDate: null,
        };

        console.log("📋 Today mode payload:", payload);
        console.log("🌐 API URL: /api/Order/revenueDashboard");
        console.log("📤 Making API call...");

        const response = await callAPIAuth({
          method: "GET",
          url: `/api/Order/revenueDashboard`,
          params: payload, // Đổi từ data sang params cho GET request
        });

        console.log("📥 API Response Status:", response?.status);
        console.log(
          "📊 API Response Data Keys:",
          response?.data ? Object.keys(response.data) : "No data"
        );
        console.log("📈 Orders count:", response?.data?.orders?.length || 0);

        if (response && response.status === 200) {
          await prepareData(response.data.orders, todayStr, null, mode);
        } else {
          console.error("❌ API call failed or returned non-200 status");
        }
      } else if (mode === "week") {
        const currentDay = (today.getDay() + 6) % 7;
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - currentDay);
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const firstDayStr = formatDateToDDMMYYYY(firstDayOfWeek);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        const lastDayStr = formatDateToDDMMYYYY(lastDayOfWeek);

        const payload = {
          startDate: firstDayStr,
          endDate: lastDayStr,
        };

        console.log("📋 Week mode payload:", payload);
        console.log("🌐 API URL: /api/Order/revenueDashboard");
        console.log("📤 Making API call...");

        const response = await callAPIAuth({
          method: "GET",
          url: `/api/Order/revenueDashboard`,
          params: payload, // Đổi từ data sang params cho GET request
        });

        console.log("📥 API Response Status:", response?.status);
        console.log(
          "📊 API Response Data Keys:",
          response?.data ? Object.keys(response.data) : "No data"
        );
        console.log("📈 Orders count:", response?.data?.orders?.length || 0);

        if (response && response.status === 200) {
          await prepareData(
            response.data.orders,
            firstDayStr,
            lastDayStr,
            mode
          );
        } else {
          console.error("❌ API call failed or returned non-200 status");
        }
      } else if (mode === "month") {
        // Get first and last day of current month
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const fromStr = formatDateToDDMMYYYY(firstDay);
        const toStr = formatDateToDDMMYYYY(lastDay);

        const payload = {
          startDate: fromStr,
          endDate: toStr,
        };

        console.log("📋 Month mode payload:", payload);
        console.log("🌐 API URL: /api/Order/revenueDashboard");
        console.log("📤 Making API call...");

        const response = await callAPIAuth({
          method: "GET",
          url: `/api/Order/revenueDashboard`,
          params: payload, // Đổi từ data sang params cho GET request
        });

        console.log("📥 API Response Status:", response?.status);
        console.log(
          "📊 API Response Data Keys:",
          response?.data ? Object.keys(response.data) : "No data"
        );
        console.log("📈 Orders count:", response?.data?.orders?.length || 0);

        if (response && response.status === 200) {
          await prepareData(response.data.orders, fromStr, toStr, mode);
        } else {
          console.error("❌ API call failed or returned non-200 status");
        }
      } else if (mode === "year") {
        // Get first and last day of current year
        const firstDay = new Date(today.getFullYear(), 0, 1);
        const lastDay = new Date(today.getFullYear(), 11, 31);

        const fromStr = formatDateToDDMMYYYY(firstDay);
        const toStr = formatDateToDDMMYYYY(lastDay);

        const payload = {
          startDate: fromStr,
          endDate: toStr,
        };

        console.log("📋 Year mode payload:", payload);
        console.log("🌐 API URL: /api/Order/revenueDashboard");
        console.log("📤 Making API call...");

        const response = await callAPIAuth({
          method: "GET",
          url: `/api/Order/revenueDashboard`,
          params: payload, // Đổi từ data sang params cho GET request
        });

        console.log("📥 API Response Status:", response?.status);
        console.log(
          "📊 API Response Data Keys:",
          response?.data ? Object.keys(response.data) : "No data"
        );
        console.log("📈 Orders count:", response?.data?.orders?.length || 0);

        if (response && response.status === 200) {
          await prepareData(response.data.orders, fromStr, toStr, mode);
        } else {
          console.error("❌ API call failed or returned non-200 status");
        }
      }
    } catch (error) {
      console.error("💥 Error while fetching dashboard:", error);
      console.log("🔍 Error details:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
      console.log(
        `✅ === FINISHED API CALL FOR MODE: ${mode.toUpperCase()} ===\n`
      );
    }
  };

  const prepareData = async (
    data: any[],
    from: string | null,
    to: string | null,
    mode: string
  ) => {
    console.log("=== DEBUG REVENUE CALCULATION ===");
    console.log("Số đơn hàng:", data.length);

    const totalRevenue = data.reduce((acc, order, orderIndex) => {
      console.log(`\n--- Đơn hàng ${orderIndex + 1} ---`);
      const orderProfit = order.orderItems.reduce(
        (orderAcc: number, item: any, itemIndex: number) => {
          const quantity = item.orderItem.quantity;
          const unitPrice = item.orderItem.unitPrice;
          const buyPrice = item.shipmentProduct.buyPrice;
          const itemProfit = (unitPrice - buyPrice) * quantity;

          console.log(`  Item ${itemIndex + 1}:`);
          console.log(`    - Sản phẩm: ${item.product?.name || "N/A"}`);
          console.log(`    - Số lượng: ${quantity}`);
          console.log(`    - Giá bán: ${unitPrice}`);
          console.log(`    - Giá nhập: ${buyPrice}`);
          console.log(`    - Lợi nhuận item: ${itemProfit}`);

          if (itemProfit < 0) {
            console.warn(
              `    ⚠️  CẢNH BÁO: Lợi nhuận âm! Giá nhập (${buyPrice}) > Giá bán (${unitPrice})`
            );
          }

          return orderAcc + itemProfit;
        },
        0
      );

      console.log(`  Tổng lợi nhuận đơn hàng: ${orderProfit}`);
      return acc + orderProfit;
    }, 0);

    console.log(`\n=== TỔNG KẾT ===`);
    console.log(`Tổng revenue: ${totalRevenue}`);
    console.log("=================================\n");

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

        // Debug profit calculation for each item in category mapping
        if (profit < 0) {
          console.warn(`⚠️  Item trong category có lợi nhuận âm:`, {
            product: product.name,
            unitPrice: orderItem.unitPrice,
            buyPrice: shipmentProduct.buyPrice,
            quantity: orderItem.quantity,
            profit: profit,
          });
        }

        const cat = revenueMap.get(product.categoryId) || {
          amount: 0,
          revenue: 0,
        };
        cat.amount += orderItem.quantity;
        cat.revenue += profit; // Vẫn cộng cả profit âm để thấy thực tế
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
            const itemRevenue = (unitPrice - buyPrice) * quantity;

            amount += quantity;
            revenue += itemRevenue;

            if (itemRevenue < 0) {
              console.warn(
                `⚠️  Chart data - Item có revenue âm tại ${title}:`,
                {
                  product: item.product?.name,
                  unitPrice,
                  buyPrice,
                  quantity,
                  itemRevenue,
                }
              );
            }
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
                  src={
                    preparedData?.bestProduct?.imageUrl || "/placeholder.svg"
                  }
                  alt="best_product"
                  className="w-[50px] h-[50px] rounded-lg border border-white/20"
                />
                <p className="text-white/70 text-md">
                  {preparedData?.bestProduct?.name || "Chưa có"}
                </p>
              </div>
            </GlassCard>

            {/* <GlassCard className="p-6 flex flex-col items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <p className="text-white/70 text-md font-bold">
                  Khách hàng VIP
                </p>
              </div>
              <p className="text-white text-2xl font-bold">
                {preparedData?.bestCustomer.fullName}
              </p>
            </GlassCard> */}
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
