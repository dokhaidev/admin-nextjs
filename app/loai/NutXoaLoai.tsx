"use client";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

interface NutXoaLoaiProps {
  id: number;
  onDeleteSuccess: (deletedId: number) => void;
}

export default function NutXoaLoai({ id, onDeleteSuccess }: NutXoaLoaiProps) {
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa loại này?")) return;

    try {
      const res = await fetch(`/api/loai/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Xóa loại thành công!");
        onDeleteSuccess(id); // Gọi callback để cập nhật UI
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xóa loại thất bại");
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
