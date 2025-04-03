import { Order } from '../../models/GiuaKy/order';
import { useInitModel } from '../../hooks/useInitModel_1';

export const useOrders = () => {
  return useInitModel<Order[]>('orders', []);
};