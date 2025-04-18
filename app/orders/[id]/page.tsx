import { IOrder } from "@/app/lib/cautrucdata";

const getOrderDetail = async (id: string): Promise<IOrder | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not defined in the environment variables"
    );
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error fetching order:", res.status, res.statusText); // Log lỗi nếu response không hợp lệ
      return null;
    }

    const data = await res.json();
    console.log("Order data:", data); // Log data nhận được từ API
    return data;
  } catch (error) {
    console.error("Error fetching order:", error); // Log lỗi khi gặp sự cố
    return null;
  }
};

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  // Đảm bảo params đã được await
  const { id } = await params; // Await params để lấy id

  const order = await getOrderDetail(id);

  if (!order) {
    return <div className="p-6 text-red-600">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id_dh}</h1>
      <div className="space-y-2">
        <p>
          <strong>Họ tên:</strong> {order.ho_ten}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Thời điểm mua:</strong>{" "}
          {new Date(order.thoi_diem_mua).toLocaleString()}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {order.status === 0
            ? "Đang xử lý"
            : order.status === 1
            ? "Đang giao"
            : "Đã giao"}
        </p>
        {order.ghi_chu && (
          <p>
            <strong>Ghi chú:</strong> {order.ghi_chu}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
