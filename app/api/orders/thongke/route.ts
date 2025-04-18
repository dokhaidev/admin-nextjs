import { NextResponse } from "next/server";
import { DonHangModel } from "@/app/lib/models";

export async function GET() {
  try {
    const total = await DonHangModel.count();
    const dangXuLy = await DonHangModel.count({ where: { status: 0 } });
    const hoanThanh = await DonHangModel.count({ where: { status: 1 } });

    return NextResponse.json({
      total,
      dangXuLy,
      hoanThanh,
    });
  } catch (error) {
    console.error("GET thongke error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
