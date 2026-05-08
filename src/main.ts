import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { BasketItems } from './components/models.ts/basket';
import { CommunicationApi } from './components/models.ts/communication_api';
import { IBuyer } from './components/models.ts/buyer';
import { TotalItems } from './components/models.ts/catalog';

import { Header } from './components/Views/header';
import { Gallery } from './components/Views/gallery';
import { Modal } from './components/Views/modal';
import { Basket } from './components/Views/basket';
import { CardCatalog } from './components/Views/card_catalog';
import { CardPreview } from './components/Views/card_preview'
import { CardBasket } from './components/Views/card_basket';
import { Order } from './components/Views/form_order';
import { Contacts } from './components/Views/form_contacts';
import { OrderSuccess } from './components/Views/order_success';

import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct, TPayment, UserProfile } from './types';

// --- Инициализация API и URL ---
const apiOrigin = import.meta.env.VITE_API_ORIGIN.replace(/\/$/, '');
const apiBaseUrl = apiOrigin.endsWith('/api/weblarek') ? apiOrigin : `${apiOrigin}/api/weblarek`;

const events = new EventEmitter();
const baseApi = new Api(apiBaseUrl);
const api = new CommunicationApi(baseApi);

// --- Инициализация Моделей ---
const totalItems = new TotalItems(events);
const basketItems = new BasketItems(events);
const buyer = new IBuyer(events);

// --- Инициализация базовых компонентов View ---
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Общие компоненты форм
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

// --- Логика и обработчики событий ---

// 1. Каталог и превью
events.on('items:changed', () => {
  gallery.catalog = totalItems.getItems().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events, {
      onClick: () => totalItems.setPreview(item)
    });
    return card.render(item);
  });
});

events.on('preview:changed', (item: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  modal.open({
    content: cardPreview.render({
      ...item,
      inCart: basketItems.isInBasket(item.id)
    })
  });
});

// 2. Корзина
events.on('basket:changed', () => {
  header.counter = basketItems.getCount();
  basketView.render({
    items: basketItems.getItems().map((item, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), events, {
        onClick: () => basketItems.remove(item.id)
      });
      return card.render({ ...item, index: index + 1 });
    }),
    total: basketItems.getTotalPrice(),
    selected: basketItems.getCount() > 0
  });
});

events.on('basket:open', () => {
  modal.open({ content: basketView.render() });
});

events.on('card:toBasket', () => {
  const item = totalItems.getPreview();
  if (item) {
    if (!basketItems.isInBasket(item.id)) {
      basketItems.add(item);
    } else {
      basketItems.remove(item.id);
    }
    modal.close();
  }
});

// 3. Формы и заказ
events.on('buyer:validation', (errors: Partial<Record<keyof UserProfile, string>>) => {
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = [errors.payment, errors.address].filter(Boolean).join('; ');
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join('; ');


});

events.on('basket:order', () => {
  modal.open({
    content: orderForm.render({
      address: '',
      payment: null,
      valid: false,
      errors: ''
    })
  });
});

events.on('order:payment-change', (data: { target: TPayment }) => {
  buyer.setData({ payment: data.target });
});


events.on('order.address:change', (data: { value: string }) => {
  buyer.setData({ address: data.value });
});

events.on('order:submit', () => {
  modal.open({
    content: contactsForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: ''
    })
  });
});

events.on('contacts.email:change', (data: { value: string }) => buyer.setData({ email: data.value }));
events.on('contacts.phone:change', (data: { value: string }) => buyer.setData({ phone: data.value }));

events.on('contacts:submit', async () => {
  const orderData = {
    ...buyer.getData(),
    total: basketItems.getTotalPrice(),
    items: basketItems.getItems().map(item => item.id)
  };

  try {
    const result = await api.sendOrder(orderData);
    const success = new OrderSuccess(cloneTemplate(successTemplate), events);
    modal.open({ content: success.render({ total: result.total }) });

    // Сброс данных
    basketItems.clear();
    buyer.clearData();
  } catch (err) {
    console.error(err);
  }
});

events.on('success:close', () => modal.close());

// --- Старт приложения ---
api.fetchProducts()
  .then(data => totalItems.setItems(data.items))
  .catch(err => console.error(err));
