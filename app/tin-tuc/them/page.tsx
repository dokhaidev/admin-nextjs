"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiSave,
  FiArrowLeft,
  FiAlertCircle,
  FiEyeOff,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";
import UploadImage from "../UploadImage";

interface FormErrors {
  tieu_de?: string;
  hinh?: string;
  mo_ta?: string;
  ngay?: string;
  noi_dung?: string;
}

export default function ThemTin() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [hinh, setHinh] = useState("");

  const validateForm = (formData: FormData) => {
    const newErrors: FormErrors = {};
    const tieu_de = formData.get("tieu_de")?.toString().trim();
    const ngay = formData.get("ngay")?.toString();
    const mo_ta = formData.get("mo_ta")?.toString().trim();
    const noi_dung = formData.get("noi_dung")?.toString().trim();
    const hinh = formData.get("hinh")?.toString();

    if (!tieu_de) newErrors.tieu_de = "Tiêu đề là bắt buộc";
    if (!ngay) newErrors.ngay = "Ngày đăng là bắt buộc";
    else if (new Date(ngay) > new Date()) newErrors.ngay = "Ngày không hợp lệ";
    if (!mo_ta) newErrors.mo_ta = "Mô tả là bắt buộc";
    if (!noi_dung) newErrors.noi_dung = "Nội dung là bắt buộc";

    if (hinh && !/^https?:\/\/.+\..+/.test(hinh)) {
      newErrors.hinh = "URL hình ảnh không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    const data = {
      tieu_de: formData.get("tieu_de"),
      hinh: formData.get("hinh"),
      ngay: formData.get("ngay"),
      mo_ta: formData.get("mo_ta"),
      noi_dung: formData.get("noi_dung"),
      an_hien: formData.get("an_hien"),
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/tin-tuc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Gửi JSON
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm tin thất bại");
      }

      toast.success("Thêm tin thành công!");
      router.push("/tin-tuc");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi thêm tin tức"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Thêm tin tức mới</h1>
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
          {/* Tiêu đề */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề *
            </label>
            <input
              type="text"
              name="tieu_de"
              className={`block w-full px-3 py-2 border ${
                errors.tieu_de ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.tieu_de && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.tieu_de}
              </p>
            )}
          </div>

          {/* Hình ảnh */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh (URL)
            </label>
            <UploadImage
              name="hinh"
              onUploaded={(url: string) => setHinh(url)}
            />
            <input type="hidden" name="hinh" value={hinh} />
            {errors.hinh && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.hinh}
              </p>
            )}
          </div>

          {/* Ngày đăng */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ngày đăng *
            </label>
            <input
              type="date"
              name="ngay"
              className={`block w-full px-3 py-2 border ${
                errors.ngay ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.ngay && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.ngay}
              </p>
            )}
          </div>

          {/* Mô tả ngắn */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả ngắn *
            </label>
            <textarea
              name="mo_ta"
              rows={3}
              className={`block w-full px-3 py-2 border ${
                errors.mo_ta ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.mo_ta && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.mo_ta}
              </p>
            )}
          </div>

          {/* Nội dung chi tiết */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nội dung chi tiết *
            </label>
            <textarea
              name="noi_dung"
              rows={6}
              className={`block w-full px-3 py-2 border ${
                errors.noi_dung ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.noi_dung && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.noi_dung}
              </p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="space-y-4">
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
                    className="h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 inline-flex items-center">
                    <FiEye className="mr-1" /> Hiển thị
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="an_hien"
                    value="0"
                    className="h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 inline-flex items-center">
                    <FiEyeOff className="mr-1" /> Ẩn
                  </span>
                </label>
              </div>
            </div>
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
            {submitting ? "Đang thêm..." : "Thêm tin tức"}
          </button>
        </div>
      </form>
    </div>
  );
}
