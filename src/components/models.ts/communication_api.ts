import { IApi, FetchData, IOrder, OrderResponse } from "../../types/index";
export class CommunicationApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<FetchData> {
    try {
      const response = await this.api.get<FetchData>('/product/');
      return response;
    } catch (error) {
      console.error('Произошла ошибка при получении каталога товаров:', error);
      throw error;
    }
  }

  async sendOrder(orderData: IOrder): Promise<OrderResponse> {
    try {
      const response = await this.api.post<{ data: OrderResponse }>('/order/', orderData);
      return response.data;
    } catch (error) {
      console.error('Произошла ошибка при отправке заказа на сервер:', error);
      throw error;
    }
  }
}
