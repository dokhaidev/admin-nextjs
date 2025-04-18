import { LoaiModel } from "@/app/lib/models";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const loai = await LoaiModel.findByPk(id);
  if (!loai) {
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(loai);
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const loai = await LoaiModel.findByPk(id);
  if (!loai) {
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  }
  await loai.destroy();
  return NextResponse.redirect(new URL("/loai", request.url));
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const ten_loai = formData.get("ten_loai") as string;
    const thu_tu = Number(formData.get("thu_tu"));
    const an_hien = formData.get("an_hien") === "1";

    const { id } = params;
    const loai = await LoaiModel.findByPk(id);
    if (!loai) {
      return NextResponse.json(
        { message: "Không tìm thấy loại" },
        { status: 404 }
      );
    }

    await loai.update({ ten_loai, thu_tu, an_hien });
    return NextResponse.json({ message: "Cập nhật thành công" });
  } catch {
    return NextResponse.json({ message: "Lỗi khi cập nhật" }, { status: 500 });
  }
}

// POST (có thể không cần thiết cho route `[id]`)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const ten_loai = formData.get("ten_loai") as string;
    const thu_tu = Number(formData.get("thu_tu"));
    const an_hien = formData.get("an_hien") === "1";

    const { id } = params;
    const loai = await LoaiModel.findByPk(id);
    if (!loai) {
      return NextResponse.json(
        { message: "Không tìm thấy loại" },
        { status: 404 }
      );
    }

    await loai.update({ ten_loai, thu_tu, an_hien });
    return NextResponse.redirect(new URL("/loai", request.url));
  } catch {
    return NextResponse.json({ message: "Lỗi khi cập nhật" }, { status: 500 });
  }
}
