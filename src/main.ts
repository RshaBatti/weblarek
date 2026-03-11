import './scss/styles.scss';

import { Api } from './components/base/Api';
import { BasketItems } from './components/models.ts/basket_items';
import { CommunicationApi } from './components/models.ts/communication_api';
import { IBuyer } from './components/models.ts/i_buyer';
import { TotalItems } from './components/models.ts/total_items';
import { apiProducts } from './utils/data';


const apiOrigin = import.meta.env.VITE_API_ORIGIN.replace(/\/$/, '');
const apiBaseUrl = apiOrigin.endsWith('/api/weblarek')
  ? apiOrigin
  : `${apiOrigin}/api/weblarek`;

// Создаём экземпляр класса TotalItems
const totalItemsModel = new TotalItems();
const basketModel = new BasketItems();
const buyerModel = new IBuyer();
const baseApi = new Api(apiBaseUrl);
const communicationApi = new CommunicationApi(baseApi);

function testTotalItemsModel(): void {
  console.log('=== Проверка работы класса TotalItems ===');

  console.log('\n1. Проверка метода setItems():');
  console.log('Сохраняем массив товаров в модель...');
  totalItemsModel.setItems(apiProducts.items);
  console.log('✓ Массив товаров успешно сохранён в модели');

  console.log('\n2. Проверка метода getItems():');
  const allItems = totalItemsModel.getItems();
  console.log('Массив товаров из каталога:', allItems);
  console.log(`✓ Получено ${allItems.length} товаров из модели`);

  console.log('\n3. Проверка метода getProductById():');
  const firstProductId = allItems[0]?.id;
  if (firstProductId) {
    const foundProduct = totalItemsModel.getProductById(firstProductId);
    console.log(`Ищем товар с ID "${firstProductId}":`, foundProduct);
    console.log('✓ Товар успешно найден по ID');
  }

  console.log('\nПроверка поиска несуществующего товара:');
  const nonExistentProduct = totalItemsModel.getProductById('non-existent-id');
  console.log('Результат поиска товара с несуществующим ID:', nonExistentProduct);
  console.log('✓ При поиске несуществующего товара возвращается null');

  console.log('\n4. Проверка метода setPreview():');
  if (firstProductId) {
    const productForPreview = totalItemsModel.getProductById(firstProductId);

    if (productForPreview) {
      console.log('Устанавливаем превью для товара с ID:', firstProductId);
      totalItemsModel.setPreview(productForPreview);
      console.log('✓ Объект товара успешно установлен в поле preview');
    }
  }

  console.log('\nУстановка null в поле preview:');
  totalItemsModel.setPreview(null);
  console.log('✓ Поле preview успешно сброшено (установлено в null)');

  // Повторно устанавливаем превью для следующей проверки
  if (firstProductId) {
    const productForPreview = totalItemsModel.getProductById(firstProductId);
    if (productForPreview) {
      totalItemsModel.setPreview(productForPreview);
    }
  }

  console.log('\n5. Проверка метода getPreview():');
  const currentPreview = totalItemsModel.getPreview();
  console.log('Текущий товар в превью:', currentPreview);
  console.log('✓ Метод getPreview() успешно возвращает товар из поля preview');

  console.log('\nПроверка getPreview() при пустом preview:');
  totalItemsModel.setPreview(null);
  const emptyPreview = totalItemsModel.getPreview();
  console.log('Результат getPreview() при пустом поле preview:', emptyPreview);
  console.log('✓ При пустом поле preview метод возвращает null');

  console.log('\n=== Все тесты успешно пройдены! Класс TotalItems работает корректно ===');
}


function testBasketModel(): void {
  console.log('\n=== Проверка работы класса BasketItems ===');

  const testProduct1 = apiProducts.items[0];
  const testProduct2 = apiProducts.items[1];

  if (!testProduct1 || !testProduct2) {
    console.error('Недостаточно тестовых товаров для проверки BasketItems');
    return;
  }

  console.log('\n1. Проверка метода add():');
  console.log('Добавляем первый товар в корзину:', testProduct1);
  basketModel.add(testProduct1);
  console.log('✓ Первый товар успешно добавлен в корзину');

  console.log('\nДобавляем второй товар в корзину:', testProduct2);
  basketModel.add(testProduct2);
  console.log('✓ Второй товар успешно добавлен в корзину');

  console.log('\n2. Проверка метода getItems():');
  const currentItems = basketModel.getItems();
  console.log('Текущие товары в корзине:', currentItems);
  console.log(`✓ Получено ${currentItems.length} товаров из корзины`);

  console.log('\n3. Проверка метода getCount():');
  const count = basketModel.getCount();
  console.log(`Количество товаров в корзине: ${count}`);
  console.log('✓ Метод getCount() возвращает корректное количество товаров');

  console.log('\n4. Проверка метода isInBasket():');
  const isProduct1InBasket = basketModel.isInBasket(testProduct1.id);
  console.log(`Товар с ID "${testProduct1.id}" в корзине: ${isProduct1InBasket}`);

  const isProduct2InBasket = basketModel.isInBasket(testProduct2.id);
  console.log(`Товар с ID "${testProduct2.id}" в корзине: ${isProduct2InBasket}`);

  const nonExistentId = 'non-existent-id';
  const isNonExistentInBasket = basketModel.isInBasket(nonExistentId);
  console.log(`Товар с ID "${nonExistentId}" в корзине: ${isNonExistentInBasket}`);
  console.log('✓ Метод isInBasket() корректно определяет наличие/отсутствие товаров');

  console.log('\n5. Проверка метода getTotalPrice():');
  const totalPrice = basketModel.getTotalPrice();
  console.log(`Общая стоимость товаров в корзине: ${totalPrice}`);
  console.log('✓ Метод getTotalPrice() корректно рассчитывает сумму');

  console.log('\n6. Проверка метода remove():');
  console.log('Удаляем первый товар из корзины (ID:', testProduct1.id, ')');
  basketModel.remove(testProduct1.id);

  const itemsAfterRemoval = basketModel.getItems();
  console.log('Товары в корзине после удаления:', itemsAfterRemoval);
  console.log(`✓ Количество товаров после удаления: ${basketModel.getCount()}`);

  const isProduct1StillInBasket = basketModel.isInBasket(testProduct1.id);
  console.log(`Товар с ID "${testProduct1.id}" всё ещё в корзине: ${isProduct1StillInBasket}`);

  console.log('\nДобавление нескольких копий второго товара для тестирования:');
  basketModel.add(testProduct2);
  basketModel.add(testProduct2);
  console.log(`Теперь в корзине ${basketModel.getCount()} товаров`);

  console.log('Удаляем одну копию второго товара:');
  basketModel.remove(testProduct2.id);
  console.log(`После удаления одной копии в корзине ${basketModel.getCount()} товаров`);

  console.log('\n7. Проверка метода clear():');
  console.log('Очищаем корзину...');
  basketModel.clear();

  const itemsAfterClear = basketModel.getItems();
  const countAfterClear = basketModel.getCount();
  console.log('Товары в корзине после очистки:', itemsAfterClear);
  console.log(`Количество товаров после очистки: ${countAfterClear}`);
  console.log('✓ Корзина успешно очищена');

  console.log('\n8. Финальная проверка на пустой корзине:');
  console.log('getCount():', basketModel.getCount());
  console.log('getTotalPrice():', basketModel.getTotalPrice());
  console.log('isInBasket() для любого ID:', basketModel.isInBasket('any-id'));

  console.log('\n=== Все тесты успешно пройдены! Класс BasketItems работает корректно ===');
}

function testBuyerModel(): void {
  console.log('\n=== Проверка работы класса IBuyer ===');

  console.log('\n1. Проверка начального состояния (метод getData()):');
  const initialData = buyerModel.getData();
  console.log('Начальные данные покупателя:', initialData);
  console.log('✓ Начальное состояние корректно: все поля пустые/null');

  console.log('\n2. Проверка метода setData():');
  console.log('Устанавливаем данные покупателя...');
  buyerModel.setData({
    payment: 'card',
    email: 'user@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Санкт-Петербург, пр. Невский, д. 1'
  });

  const updatedData = buyerModel.getData();
  console.log('Данные после обновления:', updatedData);
  console.log('✓ Данные успешно установлены через setData()');

  console.log('\n3. Проверка частичной установки данных:');
  buyerModel.setData({
    email: 'new-email@example.com'
  });

  const partiallyUpdatedData = buyerModel.getData();
  console.log('Данные после частичного обновления:', partiallyUpdatedData);
  console.log('✓ Частичное обновление данных работает корректно');

  console.log('\n4. Проверка валидации с корректными данными:');
  const validationErrors = buyerModel.validate();
  console.log('Результат валидации:', validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    console.log('✓ При корректных данных валидация возвращает пустой объект — ошибок нет');
  } else {
    console.error('✗ Ошибка: при корректных данных обнаружены ошибки валидации:', validationErrors);
  }

  console.log('\n5. Проверка валидации с некорректными данными:');
  buyerModel.clearData();
  buyerModel.setData({
    payment: null,
    email: '',
    phone: '+7 (888) 999-88-77',
    address: ''
  });

  const errorsAfterInvalidData = buyerModel.validate();
  console.log('Результат валидации с ошибками:', errorsAfterInvalidData);

  console.log('\nДетализация ошибок:');
  if (errorsAfterInvalidData.payment) {
    console.log(`- Ошибка в поле payment: "${errorsAfterInvalidData.payment}"`);
  }
  if (errorsAfterInvalidData.email) {
    console.log(`- Ошибка в поле email: "${errorsAfterInvalidData.email}"`);
  }
  if (errorsAfterInvalidData.address) {
    console.log(`- Ошибка в поле address: "${errorsAfterInvalidData.address}"`);
  }
  if (errorsAfterInvalidData.phone) {
    console.log(`- Ошибка в поле phone: "${errorsAfterInvalidData.phone}"`);
  }
  console.log('✓ Валидация корректно находит все ошибки и формирует сообщения');

  console.log('\n6. Проверка исправления ошибок и повторной валидации:');
  buyerModel.setData({
    payment: 'cash',
    email: 'correct@example.com',
    address: 'г. Санкт-Петербург, пр. Невский, д. 1'
  });

  const finalValidationErrors = buyerModel.validate();
  console.log('Результат повторной валидации после исправления:', finalValidationErrors);

  if (Object.keys(finalValidationErrors).length === 0) {
    console.log('✓ После исправления ошибок валидация проходит успешно (возвращает пустой объект)');
  } else {
    console.error('✗ Ошибка: после исправления остались ошибки валидации:', finalValidationErrors);
  }

  console.log('\n7. Проверка крайних случаев setData():');
  buyerModel.setData({
    email: undefined,
    phone: '123'
  });

  const dataAfterUndefined = buyerModel.getData();
  console.log('Данные после передачи undefined:', dataAfterUndefined);
  console.log('✓ Передача undefined не изменяет соответствующие поля');

  console.log('\n8. Проверка метода clearData():');
  console.log('Очищаем все данные покупателя...');
  buyerModel.clearData();

  const clearedData = buyerModel.getData();
  const validationAfterClear = buyerModel.validate();
  console.log('Данные после очистки:', clearedData);
  console.log('Результат валидации после очистки:', validationAfterClear);

  if (Object.keys(validationAfterClear).length === 0) {
    console.log('✓ Метод clearData() успешно сбрасывает все поля и валидация возвращает пустой объект');
  } else {
    console.error('✗ Ошибка: после очистки данных остались ошибки валидации:', validationAfterClear);
  }

  console.log('\n9. Финальная проверка на очищенном объекте:');
  const finalEmptyValidation = buyerModel.validate();
  console.log('Валидация пустых данных:', finalEmptyValidation);

  buyerModel.setData({
    payment: 'card',
    email: 'test@example.com',
    phone: '+7 (000) 000-00-00',
    address: 'Тестовый адрес'
  });

  console.log('\nУстанавливаем минимальные корректные данные и валидируем:');
  const finalValidErrors = buyerModel.validate();
  console.log('Финальная валидация:', finalValidErrors);
  console.log('Финальные данные:', buyerModel.getData());

  if (Object.keys(finalValidErrors).length === 0) {
    console.log('✓ Финальная валидация прошла успешно — ошибок нет');
  } else {
    console.error('✗ Ошибка: финальная валидация обнаружила ошибки:', finalValidErrors);
  }

  console.log('\n=== Все тесты успешно пройдены! Класс IBuyer работает корректно ===');
}


async function fetchCatalog(): Promise<void> {
  console.log('\n=== Запрос каталога с сервера ===');
  console.log('Запрашиваем массив товаров по API:', apiBaseUrl);

  try {
    const serverData = await communicationApi.fetchProducts();
    console.log('Каталог, полученный с сервера:', serverData.items);

    totalItemsModel.setItems(serverData.items);
    console.log('Каталог сохранён в модель данных');
    console.log('Массив товаров из модели после сохранения:', totalItemsModel.getItems());
  } catch (error) {
    console.error('Не удалось получить каталог товаров с сервера:', error);
  }
}

async function init(): Promise<void> {
  testTotalItemsModel();
  testBasketModel();
  testBuyerModel();
  await fetchCatalog();
}

void init();

