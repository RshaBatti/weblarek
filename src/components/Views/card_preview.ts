import { Card } from '../Views/card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardPreview {
    description: string;
    image: string;
    category: string;
    inCart: boolean;
}

export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents, actions?: { onClick: () => void }) {
        super(container, events);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:toBasket');
            if (actions?.onClick) actions.onClick();
        });
    }

    set image(value: string) {
        this.setImage(this.imageElement!, `${CDN_URL}${value}`);
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[value];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
            this.buttonElement.disabled = false;
        }
    }

    set inCart(value: boolean) {
        if (!this.buttonElement.disabled) {
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
        }
    }
}
