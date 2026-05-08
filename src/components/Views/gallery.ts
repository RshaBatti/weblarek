import { Component } from '../base/Component';

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = container;
    }

    /**
     * Сеттер для замены содержимого каталога.
     */
    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}
