
const orderDialog = document.getElementById('order-dialog');


const orderButtons = document.querySelectorAll('.product-card__button');


const closeDialogButton = document.getElementById('close-order-dialog');


const selectedProductInput = document.getElementById('selected-product');


const dialogProductLabel = document.getElementById('order-dialog-product');

// Перебираем все кнопки «Заказать».
orderButtons.forEach((button) => {
  if (!orderDialog) return;
  button.addEventListener('click', () => {
  
    const productName = button.dataset.product;

    
    selectedProductInput.value = productName;

  
    if (dialogProductLabel) {
      dialogProductLabel.textContent = productName;
    }

    orderDialog.showModal();
  });
});


if (closeDialogButton) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}


const orderForm = document.getElementById('order-form');


const successMessage = document.getElementById('success-message');


if (orderForm) orderForm.addEventListener('submit', (event) => {
  
  event.preventDefault();


  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

  
    orderForm.reportValidity();
    return;
  }

  
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

  
  orderForm.reset();

 
  orderDialog.close();
});


const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {

  const toggleBackToTop = () => {
    backToTopButton.hidden = window.scrollY < 300;
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();


  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



const reviewForm = document.getElementById('review-form');
const reviewsList = document.querySelector('.reviews-list');
const reviewSuccess = document.getElementById('review-success');
const REVIEWS_KEY = 'shop-reviews';


function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch (error) {
    return [];
  }
}


function saveReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
  
  }
}


function createReviewCard({ name, rating, text, date }, isNew = false) {
  const card = document.createElement('article');
  card.className = 'review-card' + (isNew ? ' review-card--new' : '');

  const header = document.createElement('header');
  header.className = 'review-card__header';

  const author = document.createElement('h3');
  author.className = 'review-card__author';
  author.textContent = name;

  const stars = document.createElement('p');
  stars.className = 'review-card__rating';
  stars.setAttribute('aria-label', `Оценка: ${rating} из 5`);
  stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  header.append(author, stars);

  const body = document.createElement('p');
  body.className = 'review-card__text';
  body.textContent = text;

  const time = document.createElement('p');
  time.className = 'review-card__date';
  time.textContent = date;

  card.append(header, body, time);
  return card;
}

if (reviewForm && reviewsList) {

  loadReviews().forEach((review) => {
    reviewsList.prepend(createReviewCard(review));
  });

  const getErrorBox = (field) =>
    reviewForm.querySelector(`[data-error-for="${field.id}"]`);

  const clearError = (field) => {
    field.removeAttribute('aria-invalid');
    const box = getErrorBox(field);
    if (box) {
      box.hidden = true;
      box.textContent = '';
    }
  };

  const showError = (field) => {
    field.setAttribute('aria-invalid', 'true');
    const box = getErrorBox(field);
    if (box) {
      box.textContent = field.validationMessage;
      box.hidden = false;
    }
  };

  
  reviewForm.addEventListener('input', (event) => clearError(event.target));

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    reviewSuccess.hidden = true;


    const nameField = reviewForm.elements.name;
    const textField = reviewForm.elements.text;
    nameField.value = nameField.value.trim();
    textField.value = textField.value.trim();

    const fields = Array.from(reviewForm.elements).filter((el) => el.willValidate);
    fields.forEach(clearError);

    const invalid = fields.filter((el) => !el.checkValidity());
    if (invalid.length > 0) {
      invalid.forEach(showError);
      invalid[0].focus();
      return;
    }

    const review = {
      name: nameField.value,
      rating: Number(reviewForm.elements.rating.value),
      text: textField.value,
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    reviewsList.prepend(createReviewCard(review, true));
    saveReviews([review, ...loadReviews()]);

    reviewForm.reset();
    reviewSuccess.hidden = false;
  });
}



document.querySelectorAll('.product-card__image').forEach((image) => {
  const useFallback = () => {
    image.src = 'images/placeholder.svg';
  };

 
  image.addEventListener('error', useFallback, { once: true });

 
  if (image.complete && image.naturalWidth === 0) {
    useFallback();
  }
});
