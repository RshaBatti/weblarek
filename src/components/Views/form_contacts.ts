import { Form } from './form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';


interface IContacts {
    email: string;
    phone: string;
}

export class Contacts extends Form<IContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        const handleInput = (input: HTMLInputElement, eventName: string) => {
            ['input', 'change'].forEach(event => {
                input.addEventListener(event, () => {
                    this.events.emit(eventName, { value: input.value });
                });
            });
        };

        handleInput(this.emailInput, 'contacts.email:change');
        handleInput(this.phoneInput, 'contacts.phone:change');

    }

    /**
     * Сеттер для установки email
     */
    set email(value: string) {
        this.emailInput.value = value;
    }

    /**
     * Сеттер для установки телефона
     */
    set phone(value: string) {
        this.phoneInput.value = value;
    }

    /**
     * Реализация метода отправки формы
     */
    protected onSubmit(): void {
        this.events.emit('contacts:submit', {});
    }
}
