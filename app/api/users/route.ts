import { NextResponse } from "next/server";
import { UserModel } from "@/app/lib/models";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = (page - 1) * limit;

  const { count, rows } = await UserModel.findAndCountAll({
    attributes: ["id", "email", "ho_ten", "vai_tro", "khoa"],
    order: [["id", "DESC"]],
    limit,
    offset,
  });

  return NextResponse.json({
    total: count,
    data: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  });
}
