import { IProduct } from '../../types/index';

/**
 * Класс TotalItems — модель для управления каталогом товаров и отслеживанием выбранного товара
 * Отвечает только за хранение данных, не связан с отображением
 */
export class TotalItems {
  private items: IProduct[] = [];
  private preview:  IProduct  | null = null;

  constructor() {}

  /**
   * Записывает полученный массив товаров в поле items
   * Используется при первичной загрузке данных из API
   * @param items - массив товаров для загрузки
   */
  public setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  /**
   * Возвращает актуальный массив всех товаров, хранящихся в модели
   * @returns копия массива товаров
   */
  public getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Ищет товар в массиве items по указанному id
   * @param id - идентификатор товара для поиска
   * @returns найденный товар типа IProduct или null, если товар не существует
   */
  public getProductById(id: string): IProduct | null {
    const product = this.items.find(item => item.id === id);
    return product || null;
  }

  /**
   * Устанавливает идентификатор товара в поле preview
   * Это инициирует событие открытия модального окна в интерфейсе
   * @param productId - идентификатор товара для превью или null
   */
  public setPreview(item: IProduct) {
    this.preview = item;
 }

  /**
   * Находит и возвращает объект товара из массива items, чей id совпадает со значением в поле preview
   * Если товар не найден или превью не задано, возвращает null
   * @returns найденный товар или null
   */
  public getPreview(): IProduct | null { 
        return this.preview; 
}
}


