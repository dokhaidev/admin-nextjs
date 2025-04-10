"use client";
import { ILoai } from "@/app/lib/cautrucdata";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

export default function SuaLoai({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params); // Lấy params đúng cách với React.use()
  const numericId = Number(id);

  const [loai, setLoai] = useState<ILoai | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/loai/${numericId}`);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu loại");
        }
        const data = await response.json();
        setLoai(data);
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
      const response = await fetch(`/api/loai/${numericId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      toast.success("Cập nhật loại thành công!");
      router.push("/loai");
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

  if (!loai) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-500">Loại không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Chỉnh sửa loại</h1>
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
            Tên loại
          </label>
          <input
            type="text"
            name="ten_loai"
            defaultValue={loai.ten_loai}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thứ tự
          </label>
          <input
            type="number"
            name="thu_tu"
            defaultValue={loai.thu_tu}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

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
                defaultChecked={loai.an_hien}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Hiển thị</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="an_hien"
                value="0"
                defaultChecked={!loai.an_hien}
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
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
