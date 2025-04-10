"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface NutXoaSPProps {
  id: number;
  onDeleteSuccess?: (deletedId: number) => void;
}

export default function NutXoaSP({ id, onDeleteSuccess }: NutXoaSPProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/san-pham/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Xóa sản phẩm thất bại");
      }

      toast.success("Xóa sản phẩm thành công!");

      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Lỗi không xác định khi xóa sản phẩm"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 mx-2 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Xóa sản phẩm"
    >
      {isDeleting ? (
        <span className="text-sm">Đang xóa...</span>
      ) : (
        <>
          <FiTrash2 className="text-sm" />
          <span className="text-sm">Xóa</span>
        </>
      )}
    </button>
  );
}
