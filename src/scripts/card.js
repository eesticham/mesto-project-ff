const cardTemplate = document.querySelector('#card-template').content;

export function createCard(name, link, delFunc, likeFunc, imgFunc) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  cardElement.querySelector('.card__title').textContent = name;
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__image').alt = name;

  delFunc(cardElement);
  likeFunc(cardElement);
  imgFunc(cardElement, name, link);

  return cardElement;
}