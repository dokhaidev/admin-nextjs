import { DataTypes } from "sequelize";
import { db } from "./database";
export const LoaiModel = db.define(
  "loai",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ten_loai: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, defaultValue: "" },
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "loai",
    timestamps: false,
  }
);

export const SanPhamModel = db.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ten_sp: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, defaultValue: "" },
    gia: { type: DataTypes.INTEGER, defaultValue: 0 },
    gia_km: { type: DataTypes.INTEGER, defaultValue: 0 },
    hinh: { type: DataTypes.STRING, allowNull: true },
    ngay: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    id_loai: { type: DataTypes.INTEGER, allowNull: false },
    an_hien: { type: DataTypes.BOOLEAN, defaultValue: true },
    hot: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "san_pham",
    timestamps: false,
  }
);

export const TinTucModel = db.define(
  "tin_tuc",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tieu_de: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    mo_ta: { type: DataTypes.TEXT, allowNull: true },
    hinh: { type: DataTypes.STRING, allowNull: true },
    ngay: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    noi_dung: { type: DataTypes.TEXT, allowNull: true },
    id_loai: { type: DataTypes.INTEGER, allowNull: false },
    luot_xem: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    hot: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    an_hien: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "tin_tuc",
    timestamps: false,
  }
);

export const UserModel = db.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mat_khau: { type: DataTypes.STRING, allowNull: false },
    ho_ten: { type: DataTypes.STRING, allowNull: false },
    vai_tro: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // 1: admin, 0: user
    khoa: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // 1: khóa, 0: hoạt động
    // remember_token: { type: DataTypes.STRING, allowNull: true },
    // email_verified_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export async function syncDatabase() {
  await db.sync();
}
