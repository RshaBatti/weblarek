import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderSuccess {
    total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected closeButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);

        // Инициация события при клике на кнопку
        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    /**
     * Сеттер для обновления текста о списанных средствах
     */
    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}
