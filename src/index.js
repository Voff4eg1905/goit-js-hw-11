import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const MY_PIXABAY_KEY = '33192781-4f448e121a78d7e82e3362da2';
const BASE_URL = 'https://pixabay.com/api';
let pageNumber = 1;

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMoreClick);

function onFormSubmit(event) {
  event.preventDefault();
  loadMoreEl.classList.add('is-hidden');
  galleryEl.innerHTML = '';
  pageNumber = 1;
  let searchText = event.target.elements.searchQuery.value;
  fetchImages(searchText, pageNumber)
    .then(({ data }) => {
      handleSearchResults(data);
      if (data.totalHits > 40) {
        loadMoreEl.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreClick(event) {
  let searchText = formEl.elements.searchQuery.value;

  pageNumber += 1;
  fetchImages(searchText, pageNumber)
    .then(({ data: { hits, totalHits } }) => {
      loadMoreEl.classList.remove('is-hidden');
      renderCollection(hits);
      if (totalHits - pageNumber * 40 <= 0) {
        loadMoreEl.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
function fetchImages(searchText, pageNumber) {
  const searchParameters = {
    params: {
      key: MY_PIXABAY_KEY,
      q: searchText,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: pageNumber,
    },
  };
  return axios.get(`${BASE_URL}/`, searchParameters);
}

function handleSearchResults(data) {
  const { hits, totalHits } = data;
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);
  renderCollection(hits);
}
function renderCollection(collection) {
  const markup = collection.map(element => renderImage(element)).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}
function renderImage(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;
  return `
<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">

  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>

`;
}

let lightbox = new SimpleLightbox('.gallery a', {});

