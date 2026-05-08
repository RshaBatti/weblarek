import { Card } from '../Views/card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardCatalog {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, actions?: { onClick: () => void }) {
        super(container, events);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;

        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[value];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement!, `${CDN_URL}${value}`);
    }
}
