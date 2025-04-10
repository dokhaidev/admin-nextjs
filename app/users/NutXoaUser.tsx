"use client";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

interface NutXoaUserProps {
  id: number;
  onDeleteSuccess: (deletedId: number) => void;
}

export default function NutXoaUser({ id, onDeleteSuccess }: NutXoaUserProps) {
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Xóa người dùng thành công!");
        onDeleteSuccess(id); // Gọi callback để cập nhật UI
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xóa người dùng thất bại"
      );
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 mx-2 flex items-center gap-1 transition-colors"
    >
      <FiTrash2 className="text-sm" />
      <span>Xóa</span>
    </button>
  );
}
