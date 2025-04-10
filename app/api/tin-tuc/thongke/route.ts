// app/api/tin-tuc/thongke/route.ts
import { NextResponse } from "next/server";
import { TinTucModel } from "@/app/lib/models";

export async function GET() {
  try {
    const total = await TinTucModel.count();
    const visible = await TinTucModel.count({ where: { an_hien: true } });
    const hidden = await TinTucModel.count({ where: { an_hien: false } });

    return NextResponse.json({
      success: true,
      total,
      visible,
      hidden,
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
