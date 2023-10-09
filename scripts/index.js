// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки
function addCard(name, link, delFunc) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  cardElement.querySelector('.card__description').textContent = name;
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__image').alt = name;

  delFunc(cardElement);

  return cardElement;
}

// @todo: Функция удаления карточки
function setListenerToCardDeleteButton(cardEl) {
  const deleteButton = cardEl.querySelector('.card__delete-button');

  deleteButton.addEventListener('click', function (event) {
    const listItem = event.target.closest('.places__item');

    if (listItem) {
      listItem.remove();
    }
  });
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  cardsContainer.append(addCard(element.name, element.link, setListenerToCardDeleteButton));
});
