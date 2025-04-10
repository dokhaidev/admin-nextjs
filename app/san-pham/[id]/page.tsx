"use client";

import { ISanPham, ILoai } from "@/app/lib/cautrucdata";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { FiSave, FiArrowLeft, FiEye, FiEyeOff, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import UploadImage from "../UploadImage";

export default function SuaSP(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params); // ✅ unwrap Promise
  const numericId = Number(id);
  const router = useRouter();

  const [sanPham, setSanPham] = useState<ISanPham | null>(null);
  const [loaiArr, setLoaiArr] = useState<ILoai[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLoai = await fetch(`/api/loai`);
        if (!resLoai.ok) throw new Error("Không thể tải danh sách loại");
        const loaiData = await resLoai.json();
        setLoaiArr(loaiData.data); // ✅ FIXED

        const resSP = await fetch(`/api/san-pham/${numericId}`);
        if (resSP.status === 404) throw new Error("Sản phẩm không tồn tại");
        if (!resSP.ok) throw new Error("Không thể tải thông tin sản phẩm");
        const spData = await resSP.json();
        setSanPham(spData);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Lỗi không xác định"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`/api/san-pham/${numericId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cập nhật sản phẩm thất bại");
      }

      toast.success("Cập nhật sản phẩm thành công!");
      router.push("/san-pham");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi cập nhật");
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

  if (!sanPham) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-500">Sản phẩm không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Chỉnh sửa sản phẩm</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="ten_sp"
                defaultValue={sanPham.ten_sp}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh sản phẩm
              </label>
              <UploadImage
                name="hinh"
                onUploaded={(url) => {
                  setSanPham((prev) => (prev ? { ...prev, hinh: url } : prev));
                }}
              />
              {sanPham.hinh && (
                <div className="mt-2">
                  <img
                    src={sanPham.hinh}
                    alt="Preview"
                    className="h-40 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ngày
              </label>
              <input
                type="date"
                name="ngay"
                defaultValue={sanPham.ngay}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá gốc
                </label>
                <input
                  type="number"
                  name="gia"
                  defaultValue={sanPham.gia}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá KM
                </label>
                <input
                  type="number"
                  name="gia_km"
                  defaultValue={sanPham.gia_km}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loại sản phẩm
              </label>
              <select
                name="id_loai"
                defaultValue={sanPham.id_loai}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {loaiArr.map((loai) => (
                  <option key={loai.id} value={loai.id}>
                    {loai.ten_loai}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="an_hien"
                      value="1"
                      defaultChecked={sanPham.an_hien}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
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
                      defaultChecked={!sanPham.an_hien}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 inline-flex items-center">
                      <FiEyeOff className="mr-1" /> Ẩn
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nổi bật
                </label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hot"
                      value="1"
                      defaultChecked={sanPham.hot}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
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
                      defaultChecked={!sanPham.hot}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Bình thường</span>
                  </label>
                </div>
              </div>
            </div>
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
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
