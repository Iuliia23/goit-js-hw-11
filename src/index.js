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
let total = 0;

refs.loadBtn.classList.add('hide');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', onLoadMoreClick);

const lightbox = new SimpleLightbox('.gallery a', {});

function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  const search = refs.form.elements.searchQuery.value.trim();
  if (search) {
    clearMarkup();
    generateMarkup(search);
  }
  if (!search) {
 Notiflix.Notify.info(
'Sorry, there are no images matching your search query. Please try again.'
);
return;
}
  if (e.type === 'click') {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }

function onLoadMoreClick() {
  const search = refs.form.elements.searchQuery.value.trim();
  page += 1;
  generateMarkup(search);
  console.log(search);
}

async function getPosts(search) {
  const key = '35451173-bb19ec1b965d97389129df6e3';
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const perPage = 40;
  const URL = `https://pixabay.com/api/?key=${key}&q=${search}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`;
  try {
    const response = await axios(URL);
    const data = response.data.hits;
    total += response.data.hits.length;
    if (data.length !== 0) {
      showLoadMoreBtn();
    }
     if (response.data.totalHits <= total || response.data.totalHits === 0)
      {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      // hidesLoadMoreBtn();

      console.log(response.data.totalHits);
      console.log('Кнопка має бути прихованою');
    }

    console.log(total);
    console.log(response.data.totalHits);
    return data;
  } catch (error) {
    console.log('error')} 
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

async function generateMarkup(search) {
  const data = await getPosts(search);
  const markup = data.reduce((acc, item) => {
    return acc + createMarkup(item);
  }, '');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
  return data;
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

// function hidesLoadMoreBtn() {
//   refs.loadBtn.classList.add('visually-hidden');
//   console.log('кнопку ЗАХОВАЛИ ');
// }
// hidesLoadMoreBtn();

function showLoadMoreBtn() {
  refs.loadBtn.classList.remove('hide');
  console.log('кнопка появилась');
}