import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';


export class BasketItems {
  private items: IProduct[] = [];

  constructor(private events: IEvents) { }

  public add(product: IProduct): void {
    this.items.push({ ...product });
    this.changed();
  }

  public remove(id: string): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.changed();
    }
  }


  public getCount(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
    this.changed();
  }

  protected changed() {
    this.events.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotalPrice(),
      count: this.getCount()
    });
  }

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  public isInBasket(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
