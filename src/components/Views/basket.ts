import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, createElement } from '../../utils/utils'

interface IBasket {
    items: HTMLElement[];
    total: number;
    enabled: boolean;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.submitButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
        this.items = [];
    }

    /**
     * Сеттер для заполнения списка товаров. 
     * Если массив пуст, выводит сообщение "Корзина пуста".
     */
    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listElement.replaceChildren(...items);
        } else {
            this.listElement.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    /**
     * Сеттер для установки итоговой стоимости
     */
    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    /**
     * Управляет активностью кнопки оформления
     */
    set enabled(value: boolean) {
        this.submitButton.disabled = !value;
    }
}
