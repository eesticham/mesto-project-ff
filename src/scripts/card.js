const cardTemplate = document.querySelector('#card-template').content;

export function createCard(data, delFunc, likeFunc, imgFunc, userID) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const imageEl = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likesQuantity = cardElement.querySelector('.card__likes-quantity');

  cardElement.querySelector('.card__title').textContent = data.name;
  cardElement.querySelector('.card__image').src = data.link;
  cardElement.querySelector('.card__image').alt = data.name;

  if (userID === data.owner._id) {
    deleteButton.addEventListener('click', delFunc);
  } else {
    deleteButton.remove();
  }
  likeButton.addEventListener('click', likeFunc);
  imageEl.addEventListener('click', imgFunc);

  cardElement.dataset.imgId = data._id;
  likesQuantity.textContent = data.likes.length;

  // make likeIcon active if userLike is in the "likes" array.
  let exists = data.likes.some(like => like._id === userID);
  if (exists) {
    likeButton.classList.add('card__like-button_is-active');
  }

  return cardElement;
}