import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more')
}

let page = 1;

refs.loadBtn.classList.add('hide');

refs.form.addEventListener('submit', loadPicures);
refs.loadBtn.addEventListener('click', loadPicures);

async function loadPicures(e) {
  e.preventDefault();
  const query = refs.form.elements.searchQuery.value.trim();
  if (!query) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const searchResult = await getPosts(query);
  if (!searchResult.hits.length) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (e.type === 'submit') {
    page = 1;
    clearMarkup();
    Notiflix.Notify.info(`Hooray! We found ${searchResult.totalHits} images.`);
  }
  if (searchResult.hits) {
    const markup = createMarkup(searchResult.hits);
    insertMarkup(markup);
    if (e.type === 'click') {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
   
    const lightbox = new SimpleLightbox('.gallery a');
    
    refs.loadBtn.classList.remove('hide');
   
    page += 1;

    lightbox.refresh();
  }

  if (page > Math.ceil(searchResult.totalHits / 40)) {
    refs.loadBtn.classList.add('hide');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

async function getPosts(query) {
  const key = '35451173-bb19ec1b965d97389129df6e3';
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const perPage = 40;
  const URL = `https://pixabay.com/api/?key=${key}&q=${query}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`;
  try {
    const response = await axios(URL);


    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
  } 
function createMarkup(item) {
  return `<a href="${item.largeImageURL}" class="gallery__item"
        > <div class="card">
        <img src="${item.webformatURL}" alt="${item.tags}" class="gallery__image" loading="lazy" title=""
      />
       <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${item.downloads}
    </p>
  </div>
  </div>
      </a>
   `;
}

function insertMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', data);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

