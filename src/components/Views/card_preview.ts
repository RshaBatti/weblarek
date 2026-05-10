import { Card } from '../Views/card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardPreview {
    description: string;
    image: string;
    category: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:toBasket');
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

    // Сеттер для текста кнопки
    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    // Сеттер для состояния кнопки (блокировка)
    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
