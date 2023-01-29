import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const MY_PIXABAY_KEY = '33192781-4f448e121a78d7e82e3362da2';
const BASE_URL = 'https://pixabay.com/api';

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  let searchText = event.target.elements.searchQuery.value;
  fetchImages(searchText)
    .then(({ data: { hits } }) => handleSearchResults(hits))
    .catch(error => console.log(error));
}

function fetchImages(searchText) {
  const searchParameters = {
    params: {
      key: MY_PIXABAY_KEY,
      q: searchText,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };
  return axios.get(`${BASE_URL}/`, searchParameters);
}

function handleSearchResults(hits) {
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  console.log(hits);
}
const renderImage = image => {
  const picture = `
    <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`;
};
