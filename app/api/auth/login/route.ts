import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/app/lib/models";
import { IUser } from "@/app/lib/cautrucdata";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email không tồn tại!" },
        { status: 401 }
      );
    }

    const u = user.toJSON() as IUser;

    if (u.khoa === 1) {
      return NextResponse.json(
        { error: "Tài khoản đã bị khóa!" },
        { status: 403 }
      );
    }

    if (u.vai_tro !== 1) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập admin!" },
        { status: 403 }
      );
    }

    const match = await bcrypt.compare(password, u.mat_khau);
    if (!match) {
      return NextResponse.json(
        { error: "Mật khẩu không đúng!" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: u.id,
        email: u.email,
        ho_ten: u.ho_ten,
        vai_tro: u.vai_tro,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "Đăng nhập thành công!",
        user: {
          id: u.id,
          ho_ten: u.ho_ten,
          email: u.email,
          vai_tro: u.vai_tro,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}
