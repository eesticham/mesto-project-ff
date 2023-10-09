// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки
function addCard(name, link, delFunc) {
  let cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  cardElement.querySelector('.card__description').textContent = name;
  cardElement.querySelector('.card__image').src = link;

  delFunc(cardElement);

  return cardElement;
}

// @todo: Функция удаления карточки
function delCard(cardEl) {
  let deleteButton = cardEl.querySelector('.card__delete-button');

  deleteButton.addEventListener('click', function (event) {
    let listItem = event.target.closest('.places__item');

    if (listItem) {
      listItem.remove();
    }
  });
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  cardsContainer.append(addCard(element.name, element.link, delCard));
});
