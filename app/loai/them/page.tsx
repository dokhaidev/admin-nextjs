"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSave, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

interface FormErrors {
  ten_loai?: string;
  thu_tu?: string;
}

export default function ThemLoai() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData) => {
    const newErrors: FormErrors = {};

    // Validate tên loại
    const ten_loai = formData.get("ten_loai")?.toString().trim();
    if (!ten_loai) {
      newErrors.ten_loai = "Tên loại là bắt buộc";
    } else if (ten_loai.length > 50) {
      newErrors.ten_loai = "Tên loại không quá 50 ký tự";
    }

    // Validate thứ tự
    const thu_tu = formData.get("thu_tu")?.toString();
    if (thu_tu && isNaN(Number(thu_tu))) {
      newErrors.thu_tu = "Thứ tự phải là số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/loai", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm loại thất bại");
      }

      toast.success("Thêm loại thành công!");
      router.push("/loai");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi thêm loại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Thêm loại mới</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-100 flex items-center gap-1 text-sm"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tên loại *
          </label>
          <input
            type="text"
            name="ten_loai"
            required
            className={`block w-full px-3 py-2 border ${
              errors.ten_loai ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.ten_loai && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" />
              {errors.ten_loai}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thứ tự
          </label>
          <input
            type="number"
            name="thu_tu"
            className={`block w-full px-3 py-2 border ${
              errors.thu_tu ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.thu_tu && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" />
              {errors.thu_tu}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái *
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="an_hien"
                value="1"
                defaultChecked
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Hiển thị</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="an_hien"
                value="0"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Ẩn</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="mr-2" />
            {submitting ? "Đang thêm..." : "Thêm loại"}
          </button>
        </div>
      </form>
    </div>
  );
}
