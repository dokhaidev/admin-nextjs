"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import NutXoaUser from "./NutXoaUser";

interface IUser {
  id: number;
  ho_ten: string;
  email: string;
  vai_tro: string;
  trang_thai: boolean;
}

export default function UserList() {
  const [danhSachUser, setDanhSachUser] = useState<IUser[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [dangLuuId, setDangLuuId] = useState<number | null>(null);
  const limit = 5;

  useEffect(() => {
    const taiDuLieu = async () => {
      setDangTai(true);
      try {
        const res = await fetch(`/api/users?page=${trang}&limit=${limit}`);
        if (!res.ok) throw new Error("Không thể tải dữ liệu người dùng");
        const duLieu = await res.json();
        setDanhSachUser(duLieu.data);
        setTongTrang(duLieu.totalPages);
      } catch (err) {
        setLoi(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setDangTai(false);
      }
    };
    taiDuLieu();
  }, [trang]);

  const handleDeleteSuccess = (deletedId: number) => {
    setDanhSachUser((prev) => prev.filter((user) => user.id !== deletedId));
    toast.success("Xóa người dùng thành công!");
  };

  const chuyenTrang = (trangMoi: number) => {
    if (trangMoi >= 1 && trangMoi <= tongTrang) {
      setTrang(trangMoi);
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
        <h1 className="text-2xl font-bold text-gray-900">
          Danh sách người dùng
        </h1>
        <Link
          href="/user/them"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2"
        >
          <FiPlus size={16} />
          Thêm người dùng
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
                  Họ tên
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Vai trò
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {danhSachUser.length > 0 ? (
                danhSachUser.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4">{user.ho_ten}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.vai_tro}
                        onChange={async (e) => {
                          const vaiTroMoiStr = e.target.value;
                          const vaiTroMoi = vaiTroMoiStr === "admin" ? 1 : 0;

                          setDangLuuId(user.id);
                          try {
                            const res = await fetch(`/api/users/${user.id}`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ vai_tro: vaiTroMoi }),
                            });

                            if (!res.ok)
                              throw new Error("Không thể cập nhật vai trò");

                            setDanhSachUser((prev) =>
                              prev.map((u) =>
                                u.id === user.id
                                  ? { ...u, vai_tro: vaiTroMoiStr }
                                  : u
                              )
                            );

                            toast.success("Cập nhật vai trò thành công!");
                          } catch (err) {
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Lỗi không xác định"
                            );
                          } finally {
                            setDangLuuId(null);
                          }
                        }}
                        disabled={dangLuuId === user.id}
                        className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {user.trang_thai ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiEye size={14} />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiEyeOff size={14} />
                          Vô hiệu
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/user/${user.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 border rounded text-sm font-medium hover:bg-gray-100"
                        >
                          <FiEdit size={14} />
                          Sửa
                        </Link>
                        <NutXoaUser
                          id={user.id}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Không có dữ liệu người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tongTrang > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">{(trang - 1) * limit + 1}</span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(
                    trang * limit,
                    (tongTrang - 1) * limit + danhSachUser.length
                  )}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">
                  {(tongTrang - 1) * limit + danhSachUser.length}
                </span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => chuyenTrang(1)}
                  disabled={trang === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏮
                </button>
                <button
                  onClick={() => chuyenTrang(trang - 1)}
                  disabled={trang === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: Math.min(5, tongTrang) }, (_, i) => {
                  let pageNum;
                  if (tongTrang <= 5) {
                    pageNum = i + 1;
                  } else if (trang <= 3) {
                    pageNum = i + 1;
                  } else if (trang >= tongTrang - 2) {
                    pageNum = tongTrang - 4 + i;
                  } else {
                    pageNum = trang - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => chuyenTrang(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        trang === pageNum
                          ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => chuyenTrang(trang + 1)}
                  disabled={trang === tongTrang}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => chuyenTrang(tongTrang)}
                  disabled={trang === tongTrang}
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
