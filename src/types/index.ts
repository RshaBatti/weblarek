export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface FetchData {
  total: number;
  items: IProduct[];
}

/**
 * Данные заказа, отправляемые на сервер
 * Использует существующие типы UserProfile и IProduct
 */
export interface IOrder extends UserProfile {
    total: number,
    items: string[]
}

/**
 * Ответ сервера после успешной отправки заказа
 */
export interface OrderResponse {
  total: number;
  id: string;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash' | null;

export interface UserProfile {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

