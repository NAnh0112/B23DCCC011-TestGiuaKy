export interface Order {
    id: string;
  customerId: string;
  date: string;
  total: number;
  status: OrderStatus;
  products: OrderProduct[];
}

export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  Pending = 'Chờ xác nhận',
  Shipping = 'Đang giao',
  Completed = 'Hoàn thành',
  Canceled = 'Hủy',
}
