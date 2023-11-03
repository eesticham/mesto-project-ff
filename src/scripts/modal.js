const popups = document.querySelectorAll('.popup');

function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closePopup(openedPopup);
  }
}

export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEscape);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEscape);
}

export function findPopupForm(popup) {
  return popup.querySelector('.popup__form');
}

export function findPopupCloseButton(popup) {
  return popup.querySelector('.popup__close');
}

popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened')) {
      closePopup(popup)
    }
    if (evt.target.classList.contains('popup__close')) {
      closePopup(popup)
    }
  })
})