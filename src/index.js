import './pages/index.css';
import { createCard } from './scripts/card.js';
import { openPopup, closePopup, findPopupForm } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { getInitialCards, getProfileData, patchProfileData, postNewCard, deleteCard, putLikeCard, deleteLikeCard, patchProfileAvatar } from './scripts/api.js'


const cardsContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');
const profileAvatar = document.querySelector('.profile__image');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
let currentUserId = '';

// Popups
const popups = document.querySelectorAll('.popup');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupTypeAvatar = document.querySelector('.popup_type_avatar');
const popupTypeConfirmDelete = document.querySelector('.popup_type_confirm');

const popupCaption = popupTypeImage.querySelector('.popup__caption');
const popupImage = popupTypeImage.querySelector('.popup__image');

// Forms and inputs
// edit form
const formEdit = findPopupForm(popupTypeEdit);
const nameInput = formEdit.elements.name;
const jobInput = formEdit.elements.description;
// new card form
const formNewCard = findPopupForm(popupTypeNewCard);
const placeNameInput = formNewCard.elements['place-name'];
const linkInput = formNewCard.elements.link;
// avatar
const formAvatar = findPopupForm(popupTypeAvatar);
const linkAvatarInput = formAvatar.elements.link;
// delete confirmation
const formConfirm = findPopupForm(popupTypeConfirmDelete);

// validation config
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// card listeners: like, delete, image popup:
// like func
function likeCardOnClick(evt) {
  const likeButton = evt.target;
  const likedCardElement = likeButton.closest('.card');
  const likesQuantityElement = likedCardElement.querySelector('.card__likes-quantity');

  const likeMethod = likeButton.classList.contains('card__like-button_is-active') ? deleteLikeCard : putLikeCard;
  likeMethod(likedCardElement.dataset.imgId)
    .then((response) => {
      likesQuantityElement.textContent = response.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => {
      console.log(err);
    })
}

// del card func
function deleteCardOnClick(evt) {
  const deleteButton = evt.target;
  const cardElement = deleteButton.closest('.card');
  formConfirm.dataset.imgId = cardElement.dataset.imgId;

  openPopup(popupTypeConfirmDelete);
}

function handleFormConfirmSubmit(evt) {
  evt.preventDefault();
  const listItem = cardsContainer.querySelector(`[data-img-id='${evt.target.dataset.imgId}']`);
  if (listItem) {
    deleteCard(listItem.dataset.imgId)
      .then((deleteResponse) => {
        console.log(`${deleteResponse.message}: id - ${listItem.dataset.imgId}`);
        listItem.remove();
        closePopup(popupTypeConfirmDelete);
      })
      .catch((err) => {
        console.log(err); // выводим ошибку в консоль
      })
  }
}

formConfirm.addEventListener('submit', handleFormConfirmSubmit);

// image func
function showImageOnClick(evt) {
  popupCaption.textContent = evt.target.alt;
  popupImage.src = popupImage.alt = evt.target.src;

  openPopup(popupTypeImage);
}


// edit menu
editButton.addEventListener('click', function () {
  formEdit.elements.name.value = profileName.textContent;
  formEdit.elements.description.value = profileDescription.textContent;
  clearValidation(formEdit, validationConfig);
  openPopup(popupTypeEdit);
});

function handleFormEditSubmit(evt) {
  evt.preventDefault();

  changeSubmitButtonText(formEdit, 'Сохранение...');

  patchProfileData(nameInput.value, jobInput.value)
    .then((profile) => {
      profileName.textContent = profile.name;
      profileDescription.textContent = profile.about;
      closePopup(popupTypeEdit);
      changeSubmitButtonText(formEdit, 'Сохранить');
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
}

formEdit.addEventListener('submit', handleFormEditSubmit);


// new card 
newCardButton.addEventListener('click', function () {
  formNewCard.reset();
  clearValidation(formNewCard, validationConfig);
  openPopup(popupTypeNewCard);
});

function changeSubmitButtonText(form, text) {
  form.querySelector('.button').textContent = text;
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  // change button text
  changeSubmitButtonText(formNewCard, 'Сохранение...');
  // 1 send request postNewCard
  postNewCard(placeNameInput.value, linkInput.value)
    .then((cardData) => {
      // 2 use received response to add new card
      console.log(`new card added: ${cardData._id}`);
      cardsContainer.prepend(createCard(cardData, deleteCardOnClick, likeCardOnClick, showImageOnClick, currentUserId));
      closePopup(popupTypeNewCard);
      changeSubmitButtonText(formNewCard, 'Сохранить');
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
}

formNewCard.addEventListener('submit', handleNewCardFormSubmit);


// new avatar 
profileAvatar.addEventListener('click', function () {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openPopup(popupTypeAvatar);
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  changeSubmitButtonText(formAvatar, 'Сохранение...');

  // 1 send request postNewCard
  patchProfileAvatar(linkAvatarInput.value)
    .then((response) => {
      // 2 use received response to add new card
      console.log(`avatar updated: ${response.avatar}`);
      updateProfileImage(response.avatar);
      closePopup(popupTypeAvatar);
      changeSubmitButtonText(formAvatar, 'Сохранить');
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
}

formAvatar.addEventListener('submit', handleAvatarFormSubmit);


// global settings: 
// all popups additional class for slow animation
// mousedown event listener to close popups
popups.forEach((popup) => {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
      closePopup(popup)
    }
  })
});

enableValidation(validationConfig);

// ---------------------------------------------------------------------------

function updateProfileCredentials(name, job) {
  document.querySelector('.profile__title').textContent = name;
  document.querySelector('.profile__description').textContent = job;
}

function updateProfileImage(url) {
  document.querySelector('.profile__image').style.backgroundImage = `url(${url})`;
}

// fill page content
getProfileData()
  .then((result) => {
    currentUserId = result._id;
    updateProfileImage(result.avatar);
    updateProfileCredentials(result.name, result.about);
    // fill page with cards only after receiving data about user
    // needed for cardDelete functionality 
    getInitialCards()
      .then((result) => {
        result.forEach(function (cardData) {
          cardsContainer.append(createCard(cardData, deleteCardOnClick, likeCardOnClick, showImageOnClick, currentUserId));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });