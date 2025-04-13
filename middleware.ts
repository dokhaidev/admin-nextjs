// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Hàm giải mã token
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    );
    return payload;
  } catch (error) {
    console.error("❌ Lỗi verify token:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Không có token → redirect
  if (!token) {
    console.log("⛔ Không có token, redirect về login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyJWT(token);

  // Token không hợp lệ
  if (!payload) {
    console.log("⛔ Token không hợp lệ");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 👉 Chỉ cho admin (vai_tro === 1) truy cập admin route
  if (payload.vai_tro !== 1) {
    console.log("🚫 Không đủ quyền truy cập");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Token hợp lệ, tiếp tục truy cập");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // home
    "/loai/:path*",
    "/san-pham/:path*",
    "/don-hang/:path*",
    "/tin-tuc/:path*",
    "/users/:path*",
  ],
};
