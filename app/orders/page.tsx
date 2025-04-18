"use client";
import React, { useEffect, useState } from "react";
import { IOrder } from "@/app/lib/cautrucdata";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const OrderListPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchOrders = async (page: number) => {
    const res = await fetch(`/api/orders?page=${page}&limit=${limit}`);
    if (!res.ok) {
      console.error("Failed to fetch orders");
      return;
    }
    const data = await res.json();
    setOrders(data.data);
    setPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const updateOrderStatus = async (orderId: string, status: number) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("Failed to update order status");
      return;
    }

    const data = await res.json();
    console.log(data.message);

    // Cập nhật trạng thái trong state orders
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id_dh === Number(orderId)
          ? { ...order, status } // Cập nhật trạng thái của đơn hàng
          : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h1>
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
                  Thời điểm mua
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id_dh} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id_dh}</td>
                    <td className="py-3 px-4">{order.ho_ten}</td>
                    <td className="py-3 px-4">{order.email}</td>
                    <td className="py-3 px-4">
                      {new Date(order.thoi_diem_mua).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {order.status === 0
                        ? "Đang xử lý"
                        : order.status === 1
                        ? "Đang giao"
                        : "Đã giao"}
                    </td>
                    <td className="py-3 px-4 space-x-2 flex items-center">
                      <select
                        value={String(order.status)}
                        onChange={(e) => {
                          updateOrderStatus(
                            String(order.id_dh),
                            parseInt(e.target.value)
                          );
                        }}
                        className="bg-white border border-gray-300 rounded-md text-gray-700"
                      >
                        <option value={0}>Đang xử lý</option>
                        <option value={1}>Đang giao</option>
                        <option value={2}>Đã giao</option>
                      </select>
                      {/* <Link
                        href={`/orders/${order.id_dh}`}
                        className="text-blue-600 hover:underline"
                      >
                        Xem chi tiết
                      </Link> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(page * limit, totalPages * limit)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{totalPages * limit}</span> kết quả
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Trang đầu</span>⏮
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Trước</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pageNum
                        ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Sau</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Trang cuối</span>⏭
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
