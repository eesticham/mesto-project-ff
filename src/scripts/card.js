const cardTemplate = document.querySelector('#card-template').content;

export function createCard(data, delFunc, likeFunc, imgFunc) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const likesQuantity = cardElement.querySelector('.card__likes-quantity');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardElement.querySelector('.card__title').textContent = data.name;
  cardElement.querySelector('.card__image').src = data.link;
  cardElement.querySelector('.card__image').alt = data.name;

  if (!isUserOwner(data.owner._id)) {
    deleteButton.disabled = true;
    deleteButton.classList.add('card__delete-button_inactive');
  } else {
    delFunc(cardElement);
  }
  likeFunc(cardElement);
  imgFunc(cardElement, data.name, data.link);

  cardElement.dataset.ownerId = data.owner._id;
  cardElement.dataset.imgId = data._id;
  likesQuantity.textContent = data.likes.length;

  // make likeIcon active if userLike is in the "likes" array.
  let exists = data.likes.some(like => like._id === document.querySelector(".profile__info").dataset.userId);
  if (exists) {
    likeButton.classList.add('card__like-button_is-active');
  }

  return cardElement;
}

 // returns TRUE if card owner id == profile user id, else false.
 // function to determine if card can be deleted
function isUserOwner(ownerId) {
  return document.querySelector(".profile__info").dataset.userId === ownerId;
}