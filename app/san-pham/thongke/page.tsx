"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Eye, EyeOff, Flame, PackageSearch } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductStats() {
  const [stats, setStats] = useState<{
    total: number;
    visible: number;
    hidden: number;
    hot: number;
    loading: boolean;
    error?: string;
  }>({
    total: 0,
    visible: 0,
    hidden: 0,
    hot: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/san-pham/thongke?t=" + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Dữ liệu không hợp lệ");

        setStats({
          total: data.total,
          visible: data.visible,
          hidden: data.hidden,
          hot: data.hot || 0,
          loading: false,
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Lỗi không xác định",
        }));
        toast.error("Lỗi khi tải dữ liệu thống kê sản phẩm");
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải thống kê sản phẩm...</span>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded">
        <h3 className="text-red-600 font-bold">Lỗi</h3>
        <p className="text-red-500">{stats.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const pieData = [
    { name: "Hiển thị", value: stats.visible },
    { name: "Ẩn", value: stats.hidden },
    { name: "Hot", value: stats.hot },
  ];

  const COLORS = ["#34D399", "#F87171", "#FB923C"];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">
          Thống kê Sản phẩm
          <span className="text-sm text-gray-500 ml-2 font-normal">
            (Tổng: {stats.total})
          </span>
        </h1>
        <Link
          href="/san-pham"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng số"
          value={stats.total}
          icon={<PackageSearch />}
        />
        <StatCard
          title="Đang hiển thị"
          value={stats.visible}
          color="bg-green-50"
          icon={<Eye />}
        />
        <StatCard
          title="Đang ẩn"
          value={stats.hidden}
          color="bg-red-50"
          icon={<EyeOff />}
        />
        <StatCard
          title="Sản phẩm hot"
          value={stats.hot}
          color="bg-orange-50"
          icon={<Flame />}
        />
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Chi tiết phân bố</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Tỷ lệ hiển thị:</span>{" "}
              {stats.total > 0
                ? ((stats.visible / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p>
              <span className="font-medium">Tỷ lệ ẩn:</span>{" "}
              {stats.total > 0
                ? ((stats.hidden / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Tỷ lệ sản phẩm hot:</span>{" "}
              {stats.total > 0
                ? ((stats.hot / stats.total) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p>
              <span className="font-medium">Sản phẩm thường:</span>{" "}
              {stats.total - stats.hot}
            </p>
          </div>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={70}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color = "bg-blue-50",
  icon,
}: {
  title: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`p-4 rounded-lg border ${color} flex items-center gap-3`}>
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
