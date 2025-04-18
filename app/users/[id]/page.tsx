"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Define the 'User' interface
interface User {
  email: string;
  ho_ten: string;
  vai_tro: string;
  khoa: number;
}

export default function EditUserForm() {
  const [user, setUser] = useState<User | null>(null); // Use the 'User' type here
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data: User = await res.json(); // Ensure the data matches the 'User' type
        setUser(data);
      } else {
        console.error("Không thể tải người dùng");
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const vai_tro = formData.get("vai_tro") as string;
    const khoa = formData.get("khoa") === "hoat_dong" ? 0 : 1; // Đảm bảo khoa là số (0 hoặc 1)

    if (!vai_tro || khoa === undefined) {
      alert("Vui lòng chọn vai trò và trạng thái khóa.");
      return;
    }

    console.log("Vai trò:", vai_tro);
    console.log("Khoa:", khoa);

    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vai_tro, khoa }), // Đảm bảo khoa là số
    });

    if (res.ok) {
      alert("Cập nhật thành công!");
      router.push("/users");
    } else {
      const errorMessage = await res.text(); // Lấy thông báo lỗi chi tiết từ backend
      alert(`Có lỗi xảy ra khi cập nhật: ${errorMessage}`);
    }
  };

  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="text"
          value={user.email}
          disabled
          className="w-full border border-gray-300 p-2 rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Họ tên</label>
        <input
          type="text"
          value={user.ho_ten}
          disabled
          className="w-full border border-gray-300 p-2 rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Vai trò</label>
        <select
          name="vai_tro"
          defaultValue={user.vai_tro}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Trạng thái</label>
        <select
          name="khoa"
          defaultValue={user.khoa === 0 ? "hoat_dong" : "vo_hieu"} // Đảm bảo trạng thái được hiển thị chính xác
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="hoat_dong">Hoạt động</option>
          <option value="vo_hieu">Vô hiệu</option>
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
