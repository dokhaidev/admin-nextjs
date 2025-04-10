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
  ho_ten: string;
  email: string;
  vai_tro: string; // admin | user
  trang_thai: boolean;
}
