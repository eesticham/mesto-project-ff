export function openPopup(popup, setListener) {
    popup.classList.add('popup_is-opened');
    const closeButton = findPopupCloseButton(popup);
    setListener(closeButton, 'click', () => closePopup(popup));
    setListener(popup, 'click', (evt) => {
        if (evt.target === popup) {
            closePopup(popup);
        }
    });
}

export function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

export function findPopupForm(popup) {
    return popup.querySelector('.popup__form');
}

export function findPopupCloseButton(popup) {
    return popup.querySelector('.popup__close');
}
