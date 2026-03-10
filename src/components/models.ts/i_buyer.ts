import { UserProfile, TPayment } from '../../types/index';

/**
 * Вспомогательный тип для ошибок валидации данных покупателя
 * Определяет структуру объекта с ошибками: ключи соответствуют полям UserProfile,
 * значения — текстовые сообщения об ошибках. Содержит только поля с ошибками.
 */
type UserProfileValidationErrors = Partial<Record<keyof UserProfile, string>>;

/**
 * Класс IBuyer — модель для хранения данных покупателя
 * Относится к слою Model. Отвечает за:
 * - хранение контактных данных, адреса доставки и способа оплаты;
 * - проверку корректности данных перед отправкой заказа.
 *
 * Конструктор класса не принимает параметров.
 */
export class IBuyer {
  /** Выбранный способ оплаты ('card' | 'cash' | null) */
  private payment: TPayment = null;

  /** Контактный email пользователя */
  private email: string = '';

  /** Контактный номер телефона */
  private phone: string = '';

  /** Адрес доставки товара */
  private address: string = '';

  /**
   * Объект с ошибками валидации. Ключи соответствуют полям интерфейса UserProfile,
   * значения — текстовые сообщения об ошибках. Если поле валидно, оно отсутствует в объекте.
   */
  private validationErrors: UserProfileValidationErrors = {};

  constructor() {}

  /**
   * Записывает значения в соответствующие поля класса (например, при вводе данных в форму).
   * Принимает объект с одним или несколькими полями из интерфейса UserProfile.
   * @param data - данные для обновления профиля пользователя
   */
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
  }

  /**
   * Возвращает объект, содержащий все текущие данные покупателя для последующей
   * передачи в API при оформлении заказа. Возвращаемый объект соответствует интерфейсу UserProfile.
   * @returns текущие данные покупателя типа UserProfile
   */
  public getData(): UserProfile {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  /**
   * Выполняет валидацию всех полей модели по следующим правилам:
   * - payment не должен быть null;
   * - email не должен быть пустой строкой;
   * - phone не должен быть пустой строкой;
   * - address не должен быть пустой строкой.
   * Заполняет объект validationErrors сообщениями об ошибках для невалидных полей.
   * @returns true, если все поля валидны, иначе false
   */
  public validate(): boolean {
    this.validationErrors = {};

    if (this.payment === null) {
      this.validationErrors.payment = 'Не выбран способ оплаты';
    }

    if (this.email.trim() === '') {
      this.validationErrors.email = 'Email не может быть пустым';
    }

    if (this.phone.trim() === '') {
      this.validationErrors.phone = 'Телефон не может быть пустым';
    }

    if (this.address.trim() === '') {
      this.validationErrors.address = 'Адрес не может быть пустым';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  /**
   * Сбрасывает все поля в исходное состояние (null или пустая строка)
   * после успешного завершения заказа. Также очищает объект validationErrors.
   */
  public clearData(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.validationErrors = {};
  }

  /**
   * Возвращает копию объекта validationErrors. Позволяет получить детализацию ошибок
   * для отображения в интерфейсе (например, подсветить некорректные поля формы).
   * @returns объект с ошибками валидации типа UserProfileValidationErrors
   */
  public getValidationErrors(): UserProfileValidationErrors {
    return { ...this.validationErrors };
  }
}

