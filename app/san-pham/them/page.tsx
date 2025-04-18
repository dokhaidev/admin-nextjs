"use client";

import UploadImage from "../UploadImage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiSave,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiStar,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ILoai } from "@/app/lib/cautrucdata";

interface FormErrors {
  ten_sp?: string;
  hinh?: string;
  ngay?: string;
  gia?: string;
  gia_km?: string;
  id_loai?: string;
}

export default function ThemSP() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loaiArr, setLoaiArr] = useState<ILoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hinh, setHinh] = useState("");

  useEffect(() => {
    const fetchLoaiData = async () => {
      try {
        const response = await fetch("/api/loai");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách loại");
        }

        const data = await response.json();
        const loaiList = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(loaiList)) {
          throw new Error("Dữ liệu loại không hợp lệ");
        }

        setLoaiArr(loaiList);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Lỗi không xác định"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLoaiData();
  }, []);

  const validateForm = (formData: FormData) => {
    const newErrors: FormErrors = {};
    const ten_sp = formData.get("ten_sp")?.toString().trim();
    if (!ten_sp) {
      newErrors.ten_sp = "Tên sản phẩm là bắt buộc";
    } else if (ten_sp.length > 100) {
      newErrors.ten_sp = "Tên sản phẩm không quá 100 ký tự";
    }

    const hinh = formData.get("hinh")?.toString();
    if (hinh && !/^https?:\/\/.+\..+/.test(hinh)) {
      newErrors.hinh = "URL hình ảnh không hợp lệ";
    }

    const ngay = formData.get("ngay")?.toString();
    if (!ngay) {
      newErrors.ngay = "Ngày là bắt buộc";
    } else if (new Date(ngay) > new Date()) {
      newErrors.ngay = "Ngày không thể trong tương lai";
    }

    const gia = formData.get("gia")?.toString();
    if (!gia) {
      newErrors.gia = "Giá là bắt buộc";
    } else if (isNaN(Number(gia))) {
      newErrors.gia = "Giá phải là số";
    } else if (Number(gia) <= 0) {
      newErrors.gia = "Giá phải lớn hơn 0";
    }

    const gia_km = formData.get("gia_km")?.toString();
    if (gia_km && isNaN(Number(gia_km))) {
      newErrors.gia_km = "Giá khuyến mãi phải là số";
    } else if (gia_km && Number(gia_km) <= 0) {
      newErrors.gia_km = "Giá khuyến mãi phải lớn hơn 0";
    }

    const id_loai = formData.get("id_loai")?.toString();
    if (!id_loai) {
      newErrors.id_loai = "Loại sản phẩm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Set hình vào formData
    formData.set("hinh", hinh);

    if (!validateForm(formData)) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/san-pham", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm sản phẩm thất bại");
      }
      toast.success("Thêm sản phẩm thành công!");
      router.push("/san-pham");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi thêm sản phẩm"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Thêm sản phẩm mới</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-100 flex items-center gap-1 text-sm"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="ten_sp"
                className={`block w-full px-3 py-2 border ${
                  errors.ten_sp ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.ten_sp && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.ten_sp}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh (URL)
              </label>
              <UploadImage
                name="hinh"
                onUploaded={(url: string) => setHinh(url)}
              />
              {errors.hinh && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.hinh}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ngày *
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
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá gốc *
                </label>
                <input
                  type="number"
                  name="gia"
                  className={`block w-full px-3 py-2 border ${
                    errors.gia ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.gia && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.gia}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá KM *
                </label>
                <input
                  type="number"
                  name="gia_km"
                  className={`block w-full px-3 py-2 border ${
                    errors.gia_km ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.gia_km && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.gia_km}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loại sản phẩm *
              </label>
              <select
                name="id_loai"
                className={`block w-full px-3 py-2 border ${
                  errors.id_loai ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">-- Chọn loại --</option>
                {loaiArr.map((loai) => (
                  <option key={loai.id} value={loai.id}>
                    {loai.ten_loai}
                  </option>
                ))}
              </select>
              {errors.id_loai && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {errors.id_loai}
                </p>
              )}
            </div>
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nổi bật *
                </label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hot"
                      value="1"
                      defaultChecked
                      className="h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 inline-flex items-center">
                      <FiStar className="mr-1" /> Nổi bật
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hot"
                      value="0"
                      className="h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Bình thường</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-x-4 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <FiSave className="mr-2" /> Lưu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
