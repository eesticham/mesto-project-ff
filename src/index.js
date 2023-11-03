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
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');

// Forms and inputs
// edit form
const formEdit = findPopupForm(popupTypeEdit);
const nameInput = formEdit.elements.name;
const jobInput = formEdit.elements.description;
// new card form
const formNewCard = findPopupForm(popupTypeNewCard);
const placeNameInput = formNewCard.elements['place-name'];
const linkInput = formNewCard.elements.link;

// cards listeners: like, delete, image popup:
function setListenerToLikeButton(cardEl) {
  const likeButton = cardEl.querySelector('.card__like-button');
  likeButton.addEventListener('click', function (event) {
    likeButton.classList.toggle('card__like-button_is-active');
  });
}

function setListenerToCardDeleteButton(cardEl) {
  const deleteButton = cardEl.querySelector('.card__delete-button');

  deleteButton.addEventListener('click', function (event) {
    const listItem = event.target.closest('.places__item');

    if (listItem) {
      listItem.remove();
    }
  }, { once: true });
}

const popupCaption = popupTypeImage.querySelector('.popup__caption');
const popupImage = popupTypeImage.querySelector('.popup__image');

function setListenerToCardImage(cardEl, name, link) {
  const imageEl = cardEl.querySelector('.card__image');

  imageEl.addEventListener('click', function () {
    popupCaption.textContent = name;
    popupImage.src = link;
    popupImage.alt = name;

    openPopup(popupTypeImage);
  });
}

// fill content list with cards
initialCards.forEach(function (element) {
  cardsContainer.append(createCard(element.name, element.link, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));
});

// edit menu
editButton.addEventListener('click', function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});

function handleFormEditSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupTypeEdit);
}

formEdit.addEventListener('submit', handleFormEditSubmit);

// new card add functionality 
newCardButton.addEventListener('click', function () {
  formNewCard.reset();
  openPopup(popupTypeNewCard);
});

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  cardsContainer.prepend(createCard(placeNameInput.value, linkInput.value, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));

  formNewCard.reset();
  closePopup(popupTypeNewCard);
}

formNewCard.addEventListener('submit', handleNewCardFormSubmit);

// global settings: 
// all popups additional class for slow animation
[popupTypeEdit, popupTypeNewCard, popupTypeImage].forEach(function (popup) {
  popup.classList.add('popup_is-animated');
});