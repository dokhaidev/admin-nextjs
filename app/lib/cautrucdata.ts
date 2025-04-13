export interface ILoai {
  id: number;
  ten_loai: string;
  slug: string;
  thu_tu: number;
  an_hien: boolean;
}

export interface ISanPham {
  id: number;
  ten_sp: string;
  slug: string;
  gia: number;
  gia_km: number;
  ngay: string;
  hinh: string;
  id_loai: number;
  luot_xem: number;
  hot: boolean;
  an_hien: boolean;
  tinh_chat: string;
}

export interface ITinTuc {
  id: number;
  tieu_de: string;
  slug: string;
  mo_ta: string;
  hinh: string;
  ngay: string;
  noi_dung: string;
  id_loai: number;
  luot_xem: number;
  hot: boolean;
  an_hien: boolean;
}

export interface IUser {
  id: number;
  email: string;
  mat_khau: string;
  ho_ten: string;
  vai_tro: number; // 0: user, 1: admin
  khoa: number; // 0: hoạt động, 1: bị khóa
}
