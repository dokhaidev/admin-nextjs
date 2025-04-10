import { LoaiModel } from "@/app/lib/models";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  const loai = await LoaiModel.findByPk(id);
  if (!loai) {
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(loai);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  const loai = await LoaiModel.findByPk(id);
  if (!loai) {
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  }
  await loai.destroy();
  return NextResponse.redirect(new URL("/loai", request.url));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const formData = await request.formData();
    const ten_loai = formData.get("ten_loai") as string;
    const thu_tu = Number(formData.get("thu_tu"));
    const an_hien = formData.get("an_hien") === "1";

    const { id } = context.params;
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

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const formData = await request.formData();
    const ten_loai = formData.get("ten_loai") as string;
    const thu_tu = Number(formData.get("thu_tu"));
    const an_hien = formData.get("an_hien") === "1";

    const { id } = context.params;
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
