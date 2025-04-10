import { TinTucModel } from "@/app/lib/models";
import { NextResponse } from "next/server";

// ✅ Lấy thông tin tin tức
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tin = await TinTucModel.findByPk(params.id);
  if (!tin)
    return NextResponse.json(
      { thong_bao: "Không tìm thấy tin tức" },
      { status: 404 }
    );
  return NextResponse.json(tin);
}

// ✅ Xóa tin tức
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tin = await TinTucModel.findByPk(params.id);
  if (!tin)
    return NextResponse.json(
      { thong_bao: "Không tìm thấy tin tức" },
      { status: 404 }
    );
  await tin.destroy();
  return NextResponse.redirect(new URL("/tin-tuc", req.url));
}

// ✅ Cập nhật tin tức
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();

    const tieu_de = formData.get("tieu_de") as string;
    const hinh = formData.get("hinh") as string;
    const ngay = formData.get("ngay") as string;
    const mo_ta = formData.get("mo_ta") as string;
    const noi_dung = formData.get("noi_dung") as string;
    const an_hien = formData.get("an_hien") === "1";

    const tin = await TinTucModel.findByPk(params.id);
    if (!tin)
      return NextResponse.json(
        { message: "Không tìm thấy tin tức" },
        { status: 404 }
      );

    await tin.update({ tieu_de, hinh, ngay, mo_ta, noi_dung, an_hien });

    return NextResponse.json({ message: "Cập nhật tin tức thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật tin:", error);
    return NextResponse.json(
      { message: "Lỗi server khi cập nhật tin" },
      { status: 500 }
    );
  }
}

// ❌ POST không dùng ở đây
export async function POST() {
  return NextResponse.json(
    { message: "POST không dùng ở route /tin-tuc/[id]" },
    { status: 405 }
  );
}
