"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSave, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

interface FormErrors {
  email?: string;
  mat_khau?: string;
  ho_ten?: string;
}

export default function ThemUser() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (formData: FormData) => {
    const newErrors: FormErrors = {};
    const email = formData.get("email")?.toString().trim();
    const mat_khau = formData.get("mat_khau")?.toString();
    const ho_ten = formData.get("ho_ten")?.toString().trim();

    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
    if (!mat_khau) newErrors.mat_khau = "Mật khẩu là bắt buộc";
    if (!ho_ten) newErrors.ho_ten = "Họ tên là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    const data = {
      email: formData.get("email"),
      mat_khau: formData.get("mat_khau"),
      ho_ten: formData.get("ho_ten"),
      vai_tro: formData.get("vai_tro"),
      khoa: formData.get("khoa"),
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Gửi JSON
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm người dùng thất bại");
      }

      toast.success("Thêm người dùng thành công!");
      router.push("/users"); // Điều hướng đến trang danh sách người dùng
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi thêm người dùng"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Thêm người dùng mới</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-100 flex items-center gap-1 text-sm"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              className={`block w-full px-3 py-2 border ${
                errors.email ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Họ tên */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Họ tên *
            </label>
            <input
              type="text"
              name="ho_ten"
              className={`block w-full px-3 py-2 border ${
                errors.ho_ten ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.ho_ten && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.ho_ten}
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="mat_khau"
              className={`block w-full px-3 py-2 border ${
                errors.mat_khau ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.mat_khau && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.mat_khau}
              </p>
            )}
          </div>

          {/* Vai trò */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Vai trò *
            </label>
            <select
              name="vai_tro"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={1}>Admin</option>
              <option value={0}>User</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái *
            </label>
            <select
              name="khoa"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={0}>Hoạt động</option>
              <option value={1}>Khóa</option>
            </select>
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {submitting ? "Đang thêm..." : "Thêm người dùng"}
          </button>
        </div>
      </form>
    </div>
  );
}
