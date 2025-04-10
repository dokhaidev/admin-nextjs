import { SanPhamModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

// Xóa sản phẩm
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sp = await SanPhamModel.findByPk(params.id);
  if (!sp)
    return NextResponse.json(
      { thong_bao: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  await sp.destroy();
  return NextResponse.redirect(new URL("/san-pham", req.url));
}

// Lấy thông tin sản phẩm
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sp = await SanPhamModel.findByPk(params.id);
  if (!sp)
    return NextResponse.json(
      { thong_bao: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  return NextResponse.json(sp);
}

// POST không sử dụng ở đây
export async function POST() {
  return NextResponse.json(
    { message: "POST không dùng để cập nhật ở đây" },
    { status: 405 }
  );
}

// Cập nhật sản phẩm
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const ten_sp = formData.get("ten_sp") as string;
  const gia = Number(formData.get("gia"));
  const gia_km = Number(formData.get("gia_km"));
  const hinh = formData.get("hinh") as string;
  const ngay = formData.get("ngay") as string;
  const id_loai = Number(formData.get("id_loai"));
  const an_hien = formData.get("an_hien") === "1";
  const hot = formData.get("hot") === "1";

  const sp = await SanPhamModel.findByPk(params.id);
  if (!sp)
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );

  await sp.update({ ten_sp, gia, gia_km, hinh, ngay, id_loai, an_hien, hot });

  return NextResponse.json({ message: "Cập nhật thành công" });
}
