import { TinTucModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { tieu_de, mo_ta, hinh, ngay, noi_dung, an_hien } = body;

    if (!tieu_de || !ngay || !noi_dung) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    const slug = tieu_de
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    await TinTucModel.create({
      tieu_de,
      slug,
      mo_ta,
      hinh,
      ngay,
      noi_dung,
      an_hien,
      id_loai: 1,
      luot_xem: 0,
      hot: false,
    });

    return NextResponse.json(
      { message: "Thêm tin thành công" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi thêm tin tức:", error);
    return NextResponse.json(
      { error: "Không thể thêm tin tức" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await TinTucModel.findAndCountAll({
      attributes: [
        "id",
        "tieu_de",
        "slug",
        "mo_ta",
        "hinh",
        "ngay",
        "noi_dung",
        "id_loai",
        "luot_xem",
        "hot",
        "an_hien",
      ],
      order: [["id", "desc"]],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      data: rows,
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Lỗi lấy tin tức:", error);
    return NextResponse.json(
      { error: "Không thể lấy tin tức" },
      { status: 500 }
    );
  }
}
