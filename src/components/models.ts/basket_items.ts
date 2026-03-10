import { IProduct } from '../../types/index';

/**
 * Класс BasketItems — модель для хранения выбранных пользователем товаров
 * Позволяет динамически изменять состав корзины и вычислять финансовые показатели заказа
 */
export class BasketItems {
  private items: IProduct[] = [];

  constructor() {}

  /**
   * Принимает объект товара и добавляет его в конец массива items
   * После добавления инициирует событие обновления состояния корзины
   * @param product - товар для добавления в корзину
   */
  public add(product: IProduct): void {
    this.items.push({ ...product });
  }

  /**
   * Ищет товар в массиве по его идентификатору (id) и удаляет его
   * Если в корзине несколько одинаковых товаров, удаляется только один экземпляр
   * @param id - идентификатор товара для удаления
   */
  public remove(id: string): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * Возвращает текущую длину массива items (общее количество единиц товара в корзине)
   * @returns количество товаров в корзине
   */
  public getCount(): number {
    return this.items.length;
  }

  /**
   * Очищает массив items, удаляя все товары из корзины
   * Используется после успешного оформления заказа или по запросу пользователя
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Возвращает актуальный массив всех товаров, находящихся в корзине
   * Для их последующего рендеринга в интерфейсе
   * @returns копия массива товаров корзины
   */
  public getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Рассчитывает суммарную стоимость всех товаров в массиве items
   * Если цена товара не указана (null), она считается равной 0
   * @returns общая стоимость товаров в корзине
   */
  public getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      const price = item.price ?? 0;
      return total + price;
    }, 0);
  }

  /**
   * Проверяет, содержится ли в массиве items товар с указанным id
   * Возвращает true, если товар найден, и false в противном случае
   * Используется для изменения состояния кнопок в каталоге
   * @param id - идентификатор товара для проверки
   * @returns true, если товар в корзине, иначе false
   */
  public isInBasket(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
