// Для работы с API создайте файл api.js. 
// Все запросы присвойте переменным и экспортируйте их. 
// В других модулях вы сможете импортировать эти функции и вызывать их. 

// Вот небольшой пример того, как можно обустроить код в файле api.js:
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-1',
  headers: {
    'Authorization': '0a1f212b-0a7a-4f94-b33a-45d1e7ad60af',
    'Content-Type': 'application/json'
  }
}

// 13. Общие комментарии
// 1. Не забывайте проверять, всё ли в порядке с ответом. 
// Для этого можно использовать res.ok или res.status:

// receives a []json
// [
//   {
//       "likes": [],
//       "_id": "655f4b4a73073c5946182efe",
//       "name": "Пустыня",
//       "link": "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1652341395/EducationHub/photos/sonoran-desert.jpg",
//       "owner": {
//           "name": "Jacques",
//           "about": "Sailor",
//           "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//           "_id": "d70dd5454244d1d97c3a41fd",
//           "cohort": "wff-cohort-1"
//       },
//       "createdAt": "2023-11-23T12:53:30.254Z"
//   },
// ]
export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }

      // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка getInitialCards: ${res.status} ${res.statusText}`);
  });
} 

// get profile data - json received
// {
//   "name": "Max Power",
//   "about": "Simpson alter ego",
//   "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//   "_id": "f0dc30fd78abd7a31b4f1b9b",
//   "cohort": "wff-cohort-1"
// }
export function getProfileData() {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка getProfileData: ${res.status} ${res.statusText}`);
  });
}

// patch profile credentials - json received
// {
//   "name": "Marie Skłodowska Curie",
//   "about": "Physicist and Chemist",
//   "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//   "_id": "e20537ed11237f86bbb20ccb",
//   "cohort": "cohort0",
// } 
export function patchProfileData(fullName, job) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: fullName,
      about: job
      })
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка patchProfileData: ${res.status} ${res.statusText}`);
    });
}

// add new card - response json
// {
//   "likes": [],
//   "_id": "655f391c93f84258d688ddcb",
//   "name": "Ural",
//   "link": "https://mirpozitiva.ru/wp-content/uploads/2019/11/1479628482_mirpozitiva.ru_21.jpg",
//   "owner": {
//       "name": "Max Power",
//       "about": "Simpson alter ego",
//       "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//       "_id": "f0dc30fd78abd7a31b4f1b9b",
//       "cohort": "wff-cohort-1"
//   },
//   "createdAt": "2023-11-23T11:35:56.281Z"
// }
export function postNewCard(title, url) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: title,
      link: url
      })
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка postNewCard: ${res.status} ${res.statusText}`);
    });
}

// response
//{ "message": "Пост удалён" }
export function deleteCard(cardID) {
  return fetch(`${config.baseUrl}/cards/${cardID}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка postNewCard: ${res.status} ${res.statusText}`);
    });
}


// like card - json response
// {
//   "likes": [
//     {
//       "name": "Max Power",
//       "about": "Simpson alter ego",
//       "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//       "_id": "f0dc30fd78abd7a31b4f1b9b",
//       "cohort": "wff-cohort-1"
//     }
//   ],
//     "_id": "655f391c93f84258d688ddcb",
//     "name": "Ural",
//     "link": "https://mirpozitiva.ru/wp-content/uploads/2019/11/1479628482_mirpozitiva.ru_21.jpg",
//     "owner": {
//       "name": "Max Power",
//       "about": "Simpson alter ego",
//       "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//       "_id": "f0dc30fd78abd7a31b4f1b9b",
//       "cohort": "wff-cohort-1"
//   },
//   "createdAt": "2023-11-23T11:35:56.281Z"
// }
export function putLikeCard(cardID) {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка putLikeCard: ${res.status} ${res.statusText}`);
    });
}

// same json as putLikeCard
export function deleteLikeCard(cardID) {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка deleteLikeCard: ${res.status} ${res.statusText}`);
    });
}

// json
// {
//   "name": "Max Power",
//   "about": "Simpson alter ego",
//   "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThxnWGux6FBz_OFzynjL_zj9tHmUIs4A5crg&usqp=CAU",
//   "_id": "f0dc30fd78abd7a31b4f1b9b",
//   "cohort": "wff-cohort-1"
// }
export function patchProfileAvatar(url) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      "avatar": url
    })
  })
  .then(res => {
      if (res.ok) {
      return res.json();
      }

      return Promise.reject(`Ошибка patchProfileAvatar: ${res.status} ${res.statusText}`);
    });
}