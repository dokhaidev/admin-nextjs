import { NextResponse } from "next/server";
import { UserModel } from "@/app/lib/models";

// GET: Lấy thông tin người dùng theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const user = await UserModel.findByPk(id);

    if (!user) {
      return NextResponse.json(
        { message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    const userData = user.toJSON() as {
      id: string;
      email: string;
      ten: string;
      vai_tro: number;
      khoa: number;
      // thêm các trường khác nếu có
    };

    const userFormatted = {
      ...userData,
      vai_tro: userData.vai_tro === 1 ? "admin" : "user",
      trang_thai: userData.khoa === 0,
    };

    return NextResponse.json(userFormatted);
  } catch (error: any) {
    console.error("Lỗi khi lấy người dùng:", error.message);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật vai trò người dùng
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    let { vai_tro } = body;

    // Convert string role to integer
    if (vai_tro === "admin") {
      vai_tro = 1;
    } else if (vai_tro === "user") {
      vai_tro = 0;
    } else {
      return NextResponse.json(
        { message: "Giá trị vai_tro không hợp lệ" },
        { status: 400 }
      );
    }

    const user = await UserModel.findByPk(id);

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    await user.update({ vai_tro });

    return NextResponse.json(
      { message: "Cập nhật vai trò người dùng thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi cập nhật người dùng:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
