import { UserProfile, TPayment } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Вспомогательный тип для ошибок валидации данных покупателя
 */
type UserProfileValidationErrors = Partial<Record<keyof UserProfile, string>>;

/**
 * Класс IBuyer — модель для хранения данных покупателя
 */
export class IBuyer {
  private payment: TPayment = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected events: IEvents) { }

  public setData(data: Partial<UserProfile>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email || '';
    }
    if (data.phone !== undefined) {
      this.phone = data.phone || '';
    }
    if (data.address !== undefined) {
      this.address = data.address || '';
    }

    // Сообщаем об изменении данных
    this.events.emit('buyer:changed', this.getData());

    // Генерируем событие с результатами валидации
    this.events.emit('buyer:validation', this.validate());
  }

  public getData(): UserProfile {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }


  public validate(): UserProfileValidationErrors {
    const validationErrors: UserProfileValidationErrors = {};
    if (!this.payment) {
      validationErrors.payment = 'Не выбран способ оплаты';
    }
    if (!this.address || this.address.trim() === '') {
      validationErrors.address = 'Необходимо указать адрес';
    }
    if (!this.email || this.email.trim() === '') {
      validationErrors.email = 'Необходимо указать Email';
    }
    if (!this.phone || this.phone.trim() === '') {
      validationErrors.phone = 'Необходимо указать номер телефона';
    }

    return validationErrors;
  }


  public clearData(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';

    this.events.emit('buyer:changed', this.getData());
  }
}
