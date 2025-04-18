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
      mat_khau: string;
      ho_ten: string;
      vai_tro: number;
      khoa: number;
    };

    const userFormatted = {
      ...userData,
      vai_tro: userData.vai_tro === 1 ? "admin" : "user",
      trang_thai: userData.khoa === 0, // 0 là hoạt động, 1 là khóa
    };

    return NextResponse.json(userFormatted);
  } catch (error: unknown) {
    console.error(
      "Lỗi khi lấy người dùng:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật thông tin người dùng
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { vai_tro, khoa } = body; // Changed to const

    // Kiểm tra và chuyển đổi vai_tro
    let vai_troUpdated = vai_tro; // Use a separate variable if needed

    if (vai_troUpdated) {
      vai_troUpdated = vai_troUpdated.toLowerCase();
    }

    if (vai_troUpdated === "admin") {
      vai_troUpdated = 1;
    } else if (vai_troUpdated === "user") {
      vai_troUpdated = 0;
    } else {
      return NextResponse.json(
        { message: "Giá trị vai_tro không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra giá trị khoa (khoa phải là boolean)
    if (typeof khoa !== "boolean") {
      return NextResponse.json(
        { message: "Giá trị khoa không hợp lệ" },
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

    const updated = await user.update({
      vai_tro: vai_troUpdated,
      khoa: khoa ? 1 : 0, // 1 là bị khóa, 0 là hoạt động
    });

    if (updated) {
      return NextResponse.json(
        { message: "Cập nhật người dùng thành công" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Không thể cập nhật người dùng" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error(
      "Lỗi cập nhật người dùng:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
