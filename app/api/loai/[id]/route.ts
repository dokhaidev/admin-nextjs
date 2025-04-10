import { LoaiModel } from "@/app/lib/models";
import { NextResponse } from "next/server";
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const loai = await LoaiModel.findByPk(params.id);
  if (!loai)
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  await loai.destroy();
  return NextResponse.redirect(new URL("/loai", req.url));
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const loai = await LoaiModel.findByPk(params.id);
  if (!loai)
    return NextResponse.json({ thong_bao: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(loai);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const ten_loai = formData.get("ten_loai") as string;
  const thu_tu = Number(formData.get("thu_tu"));
  const an_hien = formData.get("an_hian") === "1";
  const loai = await LoaiModel.findByPk(params.id);
  if (!loai)
    return NextResponse.json(
      { message: "Không tìm thấy loại" },
      { status: 404 }
    );
  await loai.update({ ten_loai, thu_tu, an_hien });
  return NextResponse.redirect(new URL("/loai", req.url));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const ten_loai = formData.get("ten_loai") as string;
  const thu_tu = Number(formData.get("thu_tu"));
  const an_hien = formData.get("an_hien") === "1";

  const loai = await LoaiModel.findByPk(params.id);
  if (!loai)
    return NextResponse.json(
      { message: "Không tìm thấy loại" },
      { status: 404 }
    );

  await loai.update({ ten_loai, thu_tu, an_hien });
  return NextResponse.json({ message: "Cập nhật thành công" });
}
