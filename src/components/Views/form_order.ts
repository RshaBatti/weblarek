import { Form } from './form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrder {
    address: string;
    payment: string | null;
}

export class Order extends Form<IOrder> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.buttonCard.addEventListener('click', () => {
            this.payment = 'card'; // Подсветка кнопки
            this.events.emit('order:payment-change', { target: 'card' });
        });

        this.buttonCash.addEventListener('click', () => {
            this.payment = 'cash';
            this.events.emit('order:payment-change', { target: 'cash' });
        });
        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('order.address:change', { value: target.value });
        });
    }


    set address(value: string) {
        this.addressInput.value = value;
    }


    set payment(name: string | null) {
        this.buttonCard.classList.toggle('button_alt-active', name === 'card');
        this.buttonCash.classList.toggle('button_alt-active', name === 'cash');
    }

    /**
     * Реализация абстрактного метода отправки
     */
    protected onSubmit(): void {
        this.events.emit('order:submit', {});
    }
}
