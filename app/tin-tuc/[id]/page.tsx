"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { FiSave, FiArrowLeft, FiEye, FiEyeOff, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import UploadImage from "../UploadImage";

interface ITinTuc {
  id: number;
  tieu_de: string;
  hinh: string;
  ngay: string;
  tom_tat: string;
  noi_dung: string;
  an_hien: boolean;
  hot: boolean;
}

export default function SuaTinTuc(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const numericId = Number(id);
  const router = useRouter();

  const [tinTuc, setTinTuc] = useState<ITinTuc | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tin-tuc/${numericId}`);
        if (res.status === 404) throw new Error("Tin tức không tồn tại");
        if (!res.ok) throw new Error("Không thể tải tin tức");
        const data = await res.json();
        setTinTuc(data);
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
      const res = await fetch(`/api/tin-tuc/${numericId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Cập nhật tin tức thất bại");

      toast.success("Cập nhật tin tức thành công!");
      router.push("/tin-tuc");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi cập nhật");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!tinTuc) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-500">Tin tức không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Chỉnh sửa tin tức</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-100 flex items-center gap-1 text-sm"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              name="tieu_de"
              defaultValue={tinTuc.tieu_de}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh
            </label>
            <UploadImage
              name="hinh"
              onUploaded={(url) => {
                setTinTuc((prev) => (prev ? { ...prev, hinh: url } : prev));
              }}
            />
            {tinTuc.hinh && (
              <div className="mt-2">
                <img
                  src={tinTuc.hinh}
                  alt="Hình minh họa"
                  className="h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày đăng
            </label>
            <input
              type="date"
              name="ngay"
              defaultValue={tinTuc.ngay}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tóm tắt
            </label>
            <textarea
              name="tom_tat"
              defaultValue={tinTuc.tom_tat}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <textarea
              name="noi_dung"
              defaultValue={tinTuc.noi_dung}
              rows={6}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="an_hien"
                    value="1"
                    defaultChecked={tinTuc.an_hien}
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
                    defaultChecked={!tinTuc.an_hien}
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
                Nổi bật
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hot"
                    value="1"
                    defaultChecked={tinTuc.hot}
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
                    defaultChecked={!tinTuc.hot}
                    className="h-4 w-4 text-orange-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Bình thường</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
