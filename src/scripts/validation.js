export function enableValidation(validationSettings) {
  const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
  formList.forEach((formElement) => {
    setInputEventListeners(formElement, validationSettings);
  });
};

function setInputEventListeners(formElement, validationSettings) {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, validationSettings);
      toggleButtonState(inputList, buttonElement, validationSettings);
    });
  });
};

function checkInputValidity(form, input, validationSettings) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity("");
  }

  if (input.validity.valid) {
    hideError(form, input, validationSettings);
  } else {
    showError(form, input, input.validationMessage, validationSettings);
  }
};

function showError(form, input, errorMessage, validationSettings) {
  // input.classList.add('form__input_type_error');
  input.classList.add(validationSettings.inputErrorClass);

  const formError = form.querySelector(`.${input.id}-error`);
  formError.textContent = errorMessage;
  formError.classList.add(validationSettings.errorClass);
};

function hideError(form, input, validationSettings) {
  input.classList.remove(validationSettings.inputErrorClass);

  const formError = form.querySelector(`.${input.id}-error`);
  formError.textContent = '';
  formError.classList.remove(validationSettings.errorClass);
};


function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => { return !inputElement.validity.valid; });
};

function toggleButtonState(inputList, buttonElement, validationSettings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationSettings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationSettings.inactiveButtonClass);
  }
};

// Создайте функцию clearValidation, которая очищает ошибки валидации формы и делает кнопку неактивной.
// Эта функция должна принимать как параметры DOM-элемент формы, для которой очищаются ошибки валидации и объект с настройками валидации. 
// Используйте функцию clearValidation при заполнении формы профиля во время её открытия и при очистке формы добавления карточки.

// очистка ошибок валидации вызовом clearValidation

export function clearValidation(profileForm, validationConfig) {
  const inputList = Array.from(profileForm.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = profileForm.querySelector(validationConfig.submitButtonSelector);

  // clear all errors 
  inputList.forEach((inputElement) => {
    inputElement.classList.remove(validationConfig.inputErrorClass);
  });

  let errFieldsList = Array.from(profileForm.querySelectorAll('.popup__input-error'));
  errFieldsList.forEach((errElement) => {
    errElement.textContent = '';
    errElement.classList.remove(validationConfig.errorClass);
  });

  // make submit button disabled. Because when we open popup, the button must be disabled.
  // in the edit form we have in input fields some old data. 
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
};