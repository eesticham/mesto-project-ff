import { createCard } from './scripts/card.js';
import { openPopup, closePopup, findPopupForm } from './scripts/modal.js';
import './pages/index.css';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { getInitialCards, getProfileData, patchProfileData, postNewCard, deleteCard, putLikeCard, deleteLikeCard, patchProfileAvatar } from './scripts/api.js'


const cardsContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const newCardButton = document.querySelector('.profile__add-button');
const profileAvatar = document.querySelector('.profile__image');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Popups
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
function setListenerToLikeButton(cardEl) {
  const likeButton = cardEl.querySelector('.card__like-button');
  likeButton.addEventListener('click', function (event) {
    let likes = cardEl.querySelector('.card__likes-quantity');

    if (likeButton.classList.contains('card__like-button_is-active')) {
      deleteLikeCard(cardEl.dataset.imgId)
      .then((response) => {
         likes.textContent = response.likes.length;
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      putLikeCard(cardEl.dataset.imgId)
      .then((response) => {
         likes.textContent = response.likes.length;
      })
      .catch((err) => {
        console.log(err);
      })
    }
    
    likeButton.classList.toggle('card__like-button_is-active');
  });
}

function setListenerToCardDeleteButton(cardEl) {
  const deleteButton = cardEl.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function (event) {
    formConfirm.dataset.imgId = cardEl.dataset.imgId;
    formConfirm.dataset.ownerId = cardEl.dataset.ownerId;
    const confirmContent = popupTypeConfirmDelete.querySelector('.popup__content');
    confirmContent.classList.add('popup__content_confirm');
    openPopup(popupTypeConfirmDelete);
  });
}

function handleFormConfirmSubmit(evt) {
  evt.preventDefault();
  const listItem = cardsContainer.querySelector(`[data-img-id='${evt.target.dataset.imgId}']`);
  if (listItem) {
    deleteCard(listItem.dataset.imgId)
      .then((deleteResponse) => {
        console.log(`${deleteResponse.message}: id - ${listItem.dataset.imgId}`);
      })
      .catch((err) => {
        console.log(err); // выводим ошибку в консоль
      })
      .finally(() => {
        listItem.remove();
      });
  }

  closePopup(popupTypeConfirmDelete);
}

formConfirm.addEventListener('submit', handleFormConfirmSubmit);

function setListenerToCardImage(cardEl, name, link) {
  const imageEl = cardEl.querySelector('.card__image');

  imageEl.addEventListener('click', function () {
    popupCaption.textContent = name;
    popupImage.src = link;
    popupImage.alt = name;

    openPopup(popupTypeImage);
  });
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
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
    .finally(() => {
      changeSubmitButtonText(formEdit, 'Сохранить');
    }); 

  closePopup(popupTypeEdit);
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
      cardsContainer.prepend(createCard(cardData, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
    .finally(() => {
      formNewCard.reset();
      closePopup(popupTypeNewCard);
      changeSubmitButtonText(formNewCard, 'Сохранить');
    });
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
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  })
  .finally(() => {
    formAvatar.reset();
    closePopup(popupTypeAvatar);
    changeSubmitButtonText(formAvatar, 'Сохранить');
  });
}

formAvatar.addEventListener('submit', handleAvatarFormSubmit);


// global settings: 
// all popups additional class for slow animation
[popupTypeEdit, popupTypeNewCard, popupTypeImage, popupTypeAvatar, popupTypeConfirmDelete].forEach(function (popup) {
  popup.classList.add('popup_is-animated');
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

// fill page content with user credentials
getProfileData()
  .then((result) => {
    document.querySelector(".profile__info").dataset.userId = result._id;
    updateProfileImage(result.avatar);
    updateProfileCredentials(result.name, result.about);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    // fill page card list with cards only after receiving data about user
    // needed for cardDelete functionality 
    getInitialCards()
    .then((result) => {
      result.forEach(function (cardData) {
        cardsContainer.append(createCard(cardData, setListenerToCardDeleteButton, setListenerToLikeButton, setListenerToCardImage));
      });
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    });
  });

