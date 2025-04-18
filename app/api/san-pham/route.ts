import { SanPhamModel } from "@/app/lib/models";
import { NextResponse } from "next/server";
import { Op, WhereOptions, Order } from "sequelize";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

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
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    return NextResponse.json(
      { error: "Không thể thêm sản phẩm" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "macdinh";
    const trangthai = searchParams.get("trangthai");
    const hot = searchParams.get("hot");
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (search) {
      where.ten_sp = {
        [Op.like]: `%${search}%`,
      };
    }

    if (trangthai !== null && trangthai !== undefined) {
      where.an_hien = trangthai === "1";
    }

    if (hot !== null && hot !== undefined) {
      where.hot = hot === "1";
    }

    let order: Order = [["id", "desc"]];

    if (sort === "caonhat") {
      order = [["gia", "DESC"]];
    } else if (sort === "thapnhat") {
      order = [["gia", "ASC"]];
    }

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
      where,
      order,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      data: rows,
      totalItems: count,
      totalPages,
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
