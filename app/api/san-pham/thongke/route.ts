// app/api/san-pham/thongke/route.ts
import { NextResponse } from "next/server";
import { SanPhamModel } from "@/app/lib/models";

export async function GET() {
  try {
    const total = await SanPhamModel.count();
    const visible = await SanPhamModel.count({ where: { an_hien: true } });
    const hidden = await SanPhamModel.count({ where: { an_hien: false } });
    const hot = await SanPhamModel.count({ where: { hot: true } });

    return NextResponse.json({
      success: true,
      total,
      visible,
      hidden,
      hot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Lỗi server",
      },
      { status: 500 }
    );
  }
}
