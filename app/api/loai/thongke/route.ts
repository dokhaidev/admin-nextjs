// app/api/loai/thongke/route.ts
import { LoaiModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Debug: Log để kiểm tra kết nối database
    console.log("Đang lấy thống kê danh mục...");

    // 1. Đếm tổng số danh mục
    const total = await LoaiModel.count();
    console.log("Tổng số danh mục:", total);

    // 2. Đếm danh mục đang hiển thị
    const visible = await LoaiModel.count({
      where: { an_hien: true },
      logging: console.log,
    });

    // 3. Đếm danh mục đang ẩn
    const hidden = await LoaiModel.count({
      where: { an_hien: false },
      logging: console.log,
    });

    // Kiểm tra tính hợp lệ
    if (total !== visible + hidden) {
      console.warn("Cảnh báo: Tổng số không khớp với visible + hidden");
    }

    return NextResponse.json({
      success: true,
      total,
      visible,
      hidden,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lỗi thống kê:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi thống kê danh mục",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      },
      { status: 500 }
    );
  }
}
