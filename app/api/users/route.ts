import { NextResponse } from "next/server";
import { UserModel } from "@/app/lib/models";
import bcrypt from "bcrypt"; // Đảm bảo đã cài đặt và import bcrypt

// Define User interface
interface User {
  id: number;
  email: string;
  ho_ten: string;
  vai_tro: number;
  khoa: number;
}

// Xử lý yêu cầu GET (lấy danh sách người dùng)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await UserModel.findAndCountAll({
      attributes: ["id", "email", "ho_ten", "vai_tro", "khoa"],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const formattedRows = rows.map((user) => {
      const userData = user.toJSON() as User;
      return {
        id: userData.id,
        email: userData.email,
        ho_ten: userData.ho_ten,
        vai_tro: userData.vai_tro === 1 ? "admin" : "user",
        trang_thai: userData.khoa === 0 ? "hoạt động" : "bị khóa",
      };
    });

    return NextResponse.json({
      total: count,
      data: formattedRows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return NextResponse.json(
      { message: "Không thể lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}

// Xử lý yêu cầu POST (thêm người dùng mới)
export async function POST(req: Request) {
  try {
    const { email, mat_khau, ho_ten, vai_tro, khoa } = await req.json();

    // Kiểm tra dữ liệu
    if (
      !email ||
      !mat_khau ||
      !ho_ten ||
      vai_tro === undefined ||
      khoa === undefined
    ) {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ, thiếu trường bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại trong hệ thống" },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Tạo người dùng mới trong cơ sở dữ liệu
    const newUser = await UserModel.create({
      email,
      mat_khau: hashedPassword, // Lưu mật khẩu đã mã hóa
      ho_ten,
      vai_tro, // 0 cho user, 1 cho admin
      khoa, // 0 là hoạt động, 1 là bị khóa
    });

    return NextResponse.json(
      { message: "Người dùng đã được thêm thành công", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi thêm người dùng",
      },
      { status: 500 }
    );
  }
}
