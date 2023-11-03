import { initialCards } from './scripts/cards.js';
import { createCard } from './scripts/card.js';
import { openPopup, closePopup, findPopupForm } from './scripts/modal.js';
import './pages/index.css';

const cardsContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Popups
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

// Forms and inputs
// edit form
const formEdit = findPopupForm(popupEdit);
const nameInput = formEdit.elements.name;
const jobInput = formEdit.elements.description;
// new card form
const formNewCard = findPopupForm(popupNewCard);
const placeNameInput = formNewCard.elements['place-name'];
const linkInput = formNewCard.elements.link;

// global set Listener to anything we need 
function setListenerToElement(element, eventType, callback) {
  element.addEventListener(eventType, callback);
}

// cards listeners: like, delete, image popup:
function setListenerToLikeButton(cardEl) {
  const likeButton = cardEl.querySelector('.card__like-button');
  setListenerToElement(likeButton, 'click', function (event) {
    likeButton.classList.toggle('card__like-button_is-active');
  });
}

function setListenerToCardDeleteButton(cardEl) {
  const deleteButton = cardEl.querySelector('.card__delete-button');

  setListenerToElement(deleteButton, 'click', function (event) {
    const listItem = event.target.closest('.places__item');

    if (listItem) {
      listItem.remove();
    }
  });
}

function setListenerToCardImage(cardEl, name, link) {
  const imageEl = cardEl.querySelector('.card__image');

  imageEl.addEventListener('click', function () {
    popupImage.querySelector('.popup__caption').textContent = name;
    popupImage.querySelector('.popup__image').src = link;
    popupImage.querySelector('.popup__image').alt = name;

    openPopup(popupImage, setListenerToElement);
  });
}

// fill content list with cards
initialCards.forEach(function (element) {
  cardsContainer.append(createCard(element.name, element.link, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));
});

// edit menu
setListenerToElement(editButton, 'click', function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  openPopup(popupEdit, setListenerToElement);
});

function handleFormEditSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupEdit);
}

formEdit.addEventListener('submit', handleFormEditSubmit);

// new card add functionality 
setListenerToElement(newCardButton, 'click', function () {
  openPopup(popupNewCard, setListenerToElement);
});

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  cardsContainer.prepend(createCard(placeNameInput.value, linkInput.value, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));

  formNewCard.reset();
  closePopup(popupNewCard);
}

formNewCard.addEventListener('submit', handleNewCardFormSubmit);

// global settings: 
// all popups close on "ESC"
function handleKeydown(event) {
  if (event.key === 'Escape') {
    [popupEdit, popupNewCard, popupImage].forEach(closePopup);
    event.target.removeEventListener('keydown', handleKeydown);
  }
}

document.addEventListener('keydown', handleKeydown);

// all popups additional class for slow animation
[popupEdit, popupNewCard, popupImage].forEach(function (popup) {
  popup.classList.add('popup_is-animated');
});