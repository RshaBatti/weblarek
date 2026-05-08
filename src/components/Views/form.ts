import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IFormState {
    valid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<IFormState & T> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;


    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.formElement = container;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    /**
     * Абстрактный метод, реализуемый в дочерних классах
     */
    protected abstract onSubmit(): void;

}
