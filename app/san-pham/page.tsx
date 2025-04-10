"use client";
import { ISanPham } from "../lib/cautrucdata";
import Link from "next/link";
import Image from "next/image";
import NutXoaSP from "./NutXoaSP";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function ProductList() {
  const [danhSachSP, setDanhSachSP] = useState<ISanPham[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);
  const [soSanPhamTrenTrang] = useState(10);

  useEffect(() => {
    const taiDuLieu = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
        }/api/san-pham?page=${trangHienTai}&limit=${soSanPhamTrenTrang}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `API lỗi: ${response.status} - ${response.statusText}`
          );
        }

        const duLieu = await response.json();
        setDanhSachSP(duLieu.data || []);
        setTongSoTrang(duLieu.totalPages || 1);
      } catch (err) {
        setLoi(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setDangTai(false);
      }
    };
    taiDuLieu();
  }, [trangHienTai, soSanPhamTrenTrang]);

  const handleDeleteSuccess = (deletedId: number) => {
    setDanhSachSP((prev) => prev.filter((sp) => sp.id !== deletedId));
    toast.success("Xóa sản phẩm thành công!");
  };

  const chuyenTrang = (trangMoi: number) => {
    if (trangMoi >= 1 && trangMoi <= tongSoTrang) {
      setTrangHienTai(trangMoi);
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
        <h1 className="text-2xl font-bold text-gray-900">Danh sách sản phẩm</h1>
        <Link
          href="/san-pham/them"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2"
        >
          <FiPlus size={16} />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  ID
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Tên sản phẩm
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Giá
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Hình ảnh
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Ngày
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Hot
                </th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {danhSachSP.length > 0 ? (
                danhSachSP.map((sp) => (
                  <tr
                    key={`${sp.id}-${sp.ten_sp}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{sp.id}</td>
                    <td className="py-3 px-4">{sp.ten_sp}</td>
                    <td className="py-3 px-4">
                      {Number(sp.gia).toLocaleString("vi")} VNĐ
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative w-[50px] h-[50px]">
                        <Image
                          src={sp.hinh || "/placeholder.png"}
                          fill
                          className="rounded object-cover"
                          alt={sp.ten_sp || "Không có hình"}
                          sizes="50px"
                          quality={80}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(sp.ngay).toLocaleDateString("vi", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {sp.an_hien ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiEye size={14} />
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiEyeOff size={14} />
                          Đang ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {sp.hot ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <FiTrendingUp size={14} />
                          Hot
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FiEyeOff size={14} />
                          Bình thường
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/san-pham/${sp.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 border rounded text-sm font-medium hover:bg-gray-100"
                        >
                          <FiEdit size={14} />
                          Sửa
                        </Link>
                        <NutXoaSP
                          id={sp.id}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {tongSoTrang > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          {/* Mobile view */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => chuyenTrang(trangHienTai - 1)}
              disabled={trangHienTai === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Trước
            </button>
            <button
              onClick={() => chuyenTrang(trangHienTai + 1)}
              disabled={trangHienTai === tongSoTrang}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sau
            </button>
          </div>

          {/* Desktop view */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {(trangHienTai - 1) * soSanPhamTrenTrang + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(
                    trangHienTai * soSanPhamTrenTrang,
                    tongSoTrang * soSanPhamTrenTrang
                  )}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">
                  {tongSoTrang * soSanPhamTrenTrang}
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
