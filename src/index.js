import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './PixabayAPI';
import { renderImage } from './renderImage';
let lightbox = new SimpleLightbox('.gallery a');

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();
formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMoreClick);

function onFormSubmit(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  pixabayAPI.pageNumber = 1;
  pixabayAPI.query = event.target.elements.searchQuery.value.trim();
  pixabayAPI
    .fetchImages()
    .then(({ data }) => {
      console.log(data);
      handleSearchResults(data);
      if (data.totalHits > 40) {
        loadMoreEl.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreClick() {
  pixabayAPI.pageNumber += 1;
  pixabayAPI
    .fetchImages()
    .then(({ data: { hits, totalHits } }) => {
      loadMoreEl.classList.remove('is-hidden');
      renderCollection(hits);

      if (totalHits - pixabayAPI.pageNumber * 40 <= 0) {
        loadMoreEl.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function handleSearchResults(data) {
  const { hits, totalHits } = data;

  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    formEl.reset();

    return;
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);
  renderCollection(hits);
}
function renderCollection(collection) {
  const markup = collection.map(element => renderImage(element)).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
