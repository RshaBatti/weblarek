import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс TotalItems — модель для управления каталогом товаров и отслеживанием выбранного товара
 */
export class TotalItems {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(protected events: IEvents) { }

  public setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit('items:changed', { items: this.getItems() });
  }

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public getProductById(id: string): IProduct | null {
    const product = this.items.find(item => item.id === id);
    return product || null;
  }

  public setPreview(item: IProduct | null) {
    this.preview = item;
    if (item) {
      this.events.emit('preview:changed', item);
    }
  }

  public getPreview(): IProduct | null {
    return this.preview;
  }
}
