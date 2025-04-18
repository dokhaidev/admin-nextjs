"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DangNhapPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👉 Xoá localStorage nếu middleware vừa xoá cookie (tức là bị đá ra do token sai)
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Đăng nhập thất bại!");
        return;
      }

      // 👉 Lưu vào localStorage nếu có user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.user?.vai_tro === 1) {
        toast.success("Đăng nhập thành công!");

        // ✅ Chờ 300ms để đảm bảo cookie token được browser lưu → middleware sẽ bắt được
        setTimeout(() => {
          router.replace("/"); // Replace để tránh người dùng quay lại login bằng nút Back
        }, 300);
      } else {
        toast.error("Bạn không có quyền truy cập hệ thống!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
