import { LoaiModel } from "@/app/lib/models";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const formData = await req.formData();
  const ten_loai = formData.get("ten_loai") as string;
  const thu_tu = Number(formData.get("thu_tu"));
  const an_hien = formData.get("an_hien") === "1";
  await LoaiModel.create({ ten_loai, thu_tu, an_hien });
  return NextResponse.redirect(new URL("/loai", req.url));
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = (page - 1) * limit;

  const { count, rows } = await LoaiModel.findAndCountAll({
    attributes: ["id", "ten_loai", "thu_tu", "an_hien"],
    order: [["id", "desc"]],
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
