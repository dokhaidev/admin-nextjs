import { NextResponse } from "next/server";
import {
  DonHangModel,
  DonHangChiTietModel,
  SanPhamModel,
} from "@/app/lib/models";

// Lấy thông tin đơn hàng
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching order with ID:", params.id); // Log ID để xem truy vấn có đúng không
    const order = await DonHangModel.findByPk(params.id, {
      include: [
        {
          model: DonHangChiTietModel,
          as: "chiTiet",
          include: [{ model: SanPhamModel, as: "sanPham" }],
        },
      ],
    });

    if (!order) {
      console.log("Order not found"); // Log khi không tìm thấy đơn hàng
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    console.log("Order found:", order); // Log khi tìm thấy đơn hàng
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error); // Log lỗi chi tiết
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu" },
      { status: 500 }
    );
  }
}

// Cập nhật trạng thái đơn hàng
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Kiểm tra nếu không có trạng thái
    if (body.status === undefined) {
      return NextResponse.json(
        { error: "Trạng thái là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra giá trị trạng thái hợp lệ
    if (![0, 1, 2].includes(body.status)) {
      return NextResponse.json(
        { error: "Giá trị trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng trong DB
    const updated = await DonHangModel.update(body, {
      where: { id_dh: params.id },
    });

    // Kiểm tra nếu không có đơn hàng nào được cập nhật
    if (updated[0] === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Cập nhật thành công", updated });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return NextResponse.json(
      { error: "Cập nhật đơn hàng thất bại" },
      { status: 500 }
    );
  }
}
