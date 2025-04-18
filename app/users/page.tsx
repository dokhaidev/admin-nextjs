"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import Link from "next/link";

interface IUser {
  id: number;
  ho_ten: string;
  email: string;
  vai_tro: string; // Đảm bảo vai_tro là chuỗi (admin, user)
  trang_thai: boolean; // true: hoạt động, false: bị vô hiệu
}

export default function UserList() {
  const [danhSachUser, setDanhSachUser] = useState<IUser[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [trang, setTrang] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [dangLuuId, setDangLuuId] = useState<number | null>(null);
  const limit = 10;

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

  const updateUserData = async (user: IUser, updates: Partial<IUser>) => {
    try {
      const response = await fetch(
        `http://localhost:3003/api/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vai_tro: updates.vai_tro ?? user.vai_tro, // Cập nhật vai_tro nếu có
            khoa: updates.trang_thai ?? user.trang_thai, // Cập nhật trạng_thai nếu có
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật người dùng");

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRoleChange = async (userId: number, vaiTroMoi: string) => {
    setDangLuuId(userId);
    const user = danhSachUser.find((u) => u.id === userId);
    if (!user) return;

    try {
      await updateUserData(user, { vai_tro: vaiTroMoi });
      setDanhSachUser((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, vai_tro: vaiTroMoi } : u))
      );
      toast.success("Cập nhật vai trò thành công!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setDangLuuId(null);
    }
  };

  const handleStatusChange = async (userId: number, trangThaiMoi: boolean) => {
    setDangLuuId(userId);
    const user = danhSachUser.find((u) => u.id === userId);
    if (!user) return;

    try {
      await updateUserData(user, { trang_thai: trangThaiMoi });
      setDanhSachUser((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, trang_thai: trangThaiMoi } : u
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setDangLuuId(null);
    }
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
          href="/users/them"
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
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Họ tên</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Vai trò</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                {/* <th className="py-3 px-4 text-right">Thao tác</th> */}
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
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={dangLuuId === user.id}
                        className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          handleStatusChange(user.id, !user.trang_thai)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.trang_thai
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.trang_thai ? "Hoạt động" : "Vô hiệu"}
                      </button>
                    </td>
                    {/* <td className="py-3 px-4 text-right">
                      <Link
                        href={`/users/${user.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 border rounded text-sm font-medium hover:bg-gray-100"
                      >
                        <FiEdit size={14} />
                        Sửa
                      </Link>
                    </td> */}
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
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Hiển thị{" "}
            <span className="font-medium">{(trang - 1) * limit + 1}</span> đến{" "}
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
            người dùng
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => chuyenTrang(1)}
              disabled={trang === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={() => chuyenTrang(trang - 1)}
              disabled={trang === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="py-1 px-2">{trang}</span>
            <button
              onClick={() => chuyenTrang(trang + 1)}
              disabled={trang === tongTrang}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => chuyenTrang(tongTrang)}
              disabled={trang === tongTrang}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
