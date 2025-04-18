// app/api/orders/route.ts
import { DonHangModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const offset = (page - 1) * limit;

    const { count, rows } = await DonHangModel.findAndCountAll({
      attributes: [
        "id_dh",
        "ho_ten",
        "email",
        "thoi_diem_mua",
        "status",
        "ghi_chu",
      ],
      order: [["id_dh", "DESC"]],
      limit,
      offset,
    });

    return NextResponse.json({
      total: count,
      data: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching don_hang:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
