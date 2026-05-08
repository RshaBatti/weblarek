import { Card } from '../Views/card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ICardBasket {
    index: number;
    title: string;
    price: number | null;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents, actions?: { onClick: () => void }) {
        super(container, events);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Сеттер для установки порядкового номера товара в корзине
     */
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
