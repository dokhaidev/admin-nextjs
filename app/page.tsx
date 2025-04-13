"use client";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
  FaList,
  FaEye,
  FaEyeSlash,
  FaFire,
  FaNewspaper,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Component LoadingSpinner
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2">Đang tải dữ liệu...</span>
    </div>
  );
}

// StatCard
function StatCard({
  title,
  value,
  icon,
  link,
  trend,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  link: string;
  trend?: string;
  description?: string;
}) {
  return (
    <Link
      href={link}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold my-1">{value}</p>
          {trend && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                trend.startsWith("+")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {trend}
            </span>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-3xl p-2 rounded-full bg-opacity-20 bg-gray-200">
          {icon}
        </div>
      </div>
    </Link>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  // const router = useRouter();
  const [stats, setStats] = useState({
    categories: { total: 0, visible: 0, hidden: 0 },
    products: { total: 0, visible: 0, hidden: 0, hot: 0 },
    news: { total: 0, visible: 0, hidden: 0 },
    users: 0,
    orders: 0,
    revenue: 0,
  });

  // Gọi API thống kê
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [categoryRes, productRes, newsRes] = await Promise.all([
          fetch("/api/loai/thongke"),
          fetch("/api/san-pham/thongke"),
          fetch("/api/tin-tuc/thongke"),
        ]);

        const [categoryData, productData, newsData] = await Promise.all([
          categoryRes.json(),
          productRes.json(),
          newsRes.json(),
        ]);

        setStats({
          categories: {
            total: categoryData.total || 0,
            visible: categoryData.visible || 0,
            hidden: categoryData.hidden || 0,
          },
          products: {
            total: productData.total || 0,
            visible: productData.visible || 0,
            hidden: productData.hidden || 0,
            hot: productData.hot || 0,
          },
          news: {
            total: newsData.total || 0,
            visible: newsData.visible || 0,
            hidden: newsData.hidden || 0,
          },
          users: 0,
          orders: 0,
          revenue: 0,
        });
      } catch (error) {
        toast.error("Lỗi khi tải thống kê tổng quan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng sản phẩm"
          value={stats.products.total}
          icon={<FaBox className="text-blue-500" />}
          link="/san-pham"
          description={`${stats.products.visible} hiển thị, ${stats.products.hidden} ẩn`}
        />
        <StatCard
          title="Sản phẩm hot"
          value={stats.products.hot}
          icon={<FaFire className="text-red-500" />}
          link="/san-pham?hot=true"
          trend={`${
            stats.products.total > 0
              ? Math.round((stats.products.hot / stats.products.total) * 100)
              : 0
          }%`}
        />
        <StatCard
          title="Tin tức"
          value={stats.news.total}
          icon={<FaNewspaper className="text-orange-500" />}
          link="/tin-tuc"
          description={`${stats.news.visible} hiển thị, ${stats.news.hidden} ẩn`}
        />
        <StatCard
          title="Doanh thu"
          value={`${stats.revenue.toLocaleString("vi-VN")}đ`}
          icon={<FaChartLine className="text-purple-500" />}
          link="/doanh-thu"
          trend="+5.2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FaList className="mr-2 text-green-500" />
              Thống kê Danh mục
            </h2>
            <Link
              href="/loai/thongke"
              className="text-blue-600 text-sm hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>
          <div className="grid grid-cols-3 text-center gap-4">
            <div>
              <p className="text-2xl font-bold">{stats.categories.total}</p>
              <p className="text-sm text-gray-600">Tổng</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.categories.visible}
              </p>
              <p className="text-sm text-gray-600 flex justify-center items-center">
                <FaEye className="mr-1" /> Hiển thị
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.categories.hidden}
              </p>
              <p className="text-sm text-gray-600 flex justify-center items-center">
                <FaEyeSlash className="mr-1" /> Ẩn
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FaBox className="mr-2 text-blue-500" />
              Thống kê Sản phẩm
            </h2>
            <Link
              href="/san-pham/thongke"
              className="text-blue-600 text-sm hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>
          <div className="grid grid-cols-4 text-center gap-4">
            <div>
              <p className="text-2xl font-bold">{stats.products.total}</p>
              <p className="text-sm text-gray-600">Tổng</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.products.visible}
              </p>
              <p className="text-sm text-gray-600 flex justify-center items-center">
                <FaEye className="mr-1" /> Hiển thị
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.products.hidden}
              </p>
              <p className="text-sm text-gray-600 flex justify-center items-center">
                <FaEyeSlash className="mr-1" /> Ẩn
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">
                {stats.products.hot}
              </p>
              <p className="text-sm text-gray-600 flex justify-center items-center">
                <FaFire className="mr-1" /> Hot
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Người dùng"
          value={stats.users}
          icon={<FaUsers className="text-yellow-500" />}
          link="/nguoi-dung"
          trend="+12.5%"
        />
        <StatCard
          title="Đơn hàng"
          value={stats.orders}
          icon={<FaShoppingCart className="text-teal-500" />}
          link="/don-hang"
          trend="+8.3%"
        />
      </div>
    </div>
  );
}
