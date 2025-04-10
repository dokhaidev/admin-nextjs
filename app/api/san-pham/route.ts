import { SanPhamModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  // Extract data from the form
  const ten_sp = formData.get("ten_sp") as string;
  const gia = Number(formData.get("gia"));
  const gia_km = Number(formData.get("gia_km"));
  const hinh = formData.get("hinh") as string;
  const ngay = formData.get("ngay") as string;
  const id_loai = Number(formData.get("id_loai"));
  const an_hien = formData.get("an_hien") === "1";
  const hot = formData.get("hot") === "1";

  await SanPhamModel.create({
    ten_sp,
    gia,
    gia_km,
    hinh,
    ngay,
    id_loai,
    an_hien,
    hot,
  });
  return NextResponse.redirect(new URL("/san-pham", req.url));
}

export async function GET(req: Request) {
  try {
    // Lấy tham số phân trang từ URL
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Sử dụng findAndCountAll để lấy cả dữ liệu và tổng số bản ghi
    const { count, rows } = await SanPhamModel.findAndCountAll({
      attributes: [
        "id",
        "ten_sp",
        "gia",
        "gia_km",
        "hinh",
        "ngay",
        "id_loai",
        "an_hien",
        "hot",
      ],
      order: [["id", "desc"]],
      limit: limit,
      offset: offset,
    });

    // Tính toán tổng số trang
    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      data: rows,
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    return NextResponse.json(
      { error: "Không thể lấy sản phẩm" },
      { status: 500 }
    );
  }
}
