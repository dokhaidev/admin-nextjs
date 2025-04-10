"use client";
import { ITinTuc } from "../lib/cautrucdata";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiTrendingUp,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
} from "react-icons/fi";
import { toast } from "react-toastify";
import NutXoaTin from "./NutXoaTin";

export default function TinTucList() {
  const [danhSachTin, setDanhSachTin] = useState<ITinTuc[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);
  const [soTinTrenTrang] = useState(10);

  useEffect(() => {
    const taiTin = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
        }/api/tin-tuc?page=${trangHienTai}&limit=${soTinTrenTrang}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
        const data = await res.json();
        setDanhSachTin(data.data || []);
        setTongSoTrang(data.totalPages || 1);
      } catch (err) {
        setLoi(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setDangTai(false);
      }
    };
    taiTin();
  }, [trangHienTai]);

  const handleDeleteSuccess = (deletedId: number) => {
    setDanhSachTin((prev) => prev.filter((sp) => sp.id !== deletedId));
    toast.success("Xóa sản phẩm thành công!");
  };

  const chuyenTrang = (trangMoi: number) => {
    if (trangMoi >= 1 && trangMoi <= tongSoTrang) {
      setTrangHienTai(trangMoi);
    }
  };

  const handleXoaTin = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tin này không?")) return;
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
        }/api/tin-tuc/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Xóa tin thất bại");
      toast.success("Đã xóa tin thành công");
      setDanhSachTin((prev) => prev.filter((tin) => tin.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi khi xóa tin");
    }
  };

  if (dangTai) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loi) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-600 font-bold">Đã xảy ra lỗi</h3>
        <p className="text-red-500">{loi}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Danh sách tin tức</h1>
        <Link
          href="/tin-tuc/them"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
        >
          <FiPlus /> Thêm tin
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tiêu đề</th>
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Hình</th>
              <th className="px-4 py-3 text-left">Hiện</th>
              <th className="px-4 py-3 text-left">Hot</th>
              <th className="px-4 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {danhSachTin.length > 0 ? (
              danhSachTin.map((tin) => (
                <tr key={tin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{tin.id}</td>
                  <td className="px-4 py-3">{tin.tieu_de}</td>
                  <td className="px-4 py-3">
                    {new Date(tin.ngay).toLocaleDateString("vi")}
                  </td>
                  <td className="px-4 py-3">
                    <img src={tin.hinh} alt="" className="w-12 h-12 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    {tin.an_hien ? (
                      <span className="text-green-600 inline-flex items-center gap-1 text-sm">
                        <FiEye /> Hiển thị
                      </span>
                    ) : (
                      <span className="text-red-600 inline-flex items-center gap-1 text-sm">
                        <FiEyeOff /> Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {tin.hot ? (
                      <span className="text-orange-600 inline-flex items-center gap-1 text-sm">
                        <FiTrendingUp /> Hot
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">Bình thường</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/tin-tuc/${tin.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 border rounded text-sm font-medium hover:bg-gray-100"
                      >
                        <FiEdit size={14} />
                        Sửa
                      </Link>
                      <NutXoaTin
                        id={tin.id}
                        onDeleteSuccess={handleDeleteSuccess}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không có tin tức
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {tongSoTrang > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => chuyenTrang(trangHienTai - 1)}
              disabled={trangHienTai === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => chuyenTrang(trangHienTai + 1)}
              disabled={trangHienTai === tongSoTrang}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {(trangHienTai - 1) * soTinTrenTrang + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(
                    trangHienTai * soTinTrenTrang,
                    tongSoTrang * soTinTrenTrang
                  )}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">
                  {tongSoTrang * soTinTrenTrang}
                </span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => chuyenTrang(1)}
                  disabled={trangHienTai === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏮
                </button>
                <button
                  onClick={() => chuyenTrang(trangHienTai - 1)}
                  disabled={trangHienTai === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: Math.min(5, tongSoTrang) }, (_, i) => {
                  let pageNum;
                  if (tongSoTrang <= 5) {
                    pageNum = i + 1;
                  } else if (trangHienTai <= 3) {
                    pageNum = i + 1;
                  } else if (trangHienTai >= tongSoTrang - 2) {
                    pageNum = tongSoTrang - 4 + i;
                  } else {
                    pageNum = trangHienTai - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => chuyenTrang(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        trangHienTai === pageNum
                          ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => chuyenTrang(trangHienTai + 1)}
                  disabled={trangHienTai === tongSoTrang}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => chuyenTrang(tongSoTrang)}
                  disabled={trangHienTai === tongSoTrang}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏭
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
