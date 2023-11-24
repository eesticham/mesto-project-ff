const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-1',
  headers: {
    'Authorization': '0a1f212b-0a7a-4f94-b33a-45d1e7ad60af',
    'Content-Type': 'application/json'
  }
}

export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'GET',
    headers: config.headers
  })
  .then(handleResponse)
}

export function getProfileData() {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers
  })
  .then(handleResponse)
}

export function patchProfileData(fullName, job) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: fullName,
      about: job
    })
  })
  .then(handleResponse)
}

export function postNewCard(title, url) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: title,
      link: url
    })
  })
  .then(handleResponse)
}

export function deleteCard(cardID) {
  return fetch(`${config.baseUrl}/cards/${cardID}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleResponse)
}

export function putLikeCard(cardID) {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(handleResponse)
}

export function deleteLikeCard(cardID) {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleResponse)
}

export function patchProfileAvatar(url) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      "avatar": url
    })
  })
  .then(handleResponse)
}

function handleResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status} ${res.statusText}`);
  }
}