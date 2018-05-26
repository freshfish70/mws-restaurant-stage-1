import restaurantHandler from './restaurantHandler'
import offlineNotice from './offlineNotice'
import maps from './googleMaps'

(function () {

  let currentRestaurant;
  let map;

  /**
   * Form handling
   */
  const form = document.getElementById('restaurant-review-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    formData.append('restaurant_id', currentRestaurant.id);
    formData.append('updatedAt', Date.now());

    let reviewObject = {};
    for (let [key, value] of formData) {
      if (!isNaN(value)){
        value = parseInt(value);
      }
      reviewObject[key] = value;
    }
    restaurantHandler.reviewRestaurant(formData, reviewObject, (error, review) => {
      if (error) {
        console.log(error)
      }
      fillReviewList([review]);
    });
  })

  function createFavoriteButton() {
    const addText = "Add to favorite ";
    const removeText = "Remove favorite ";
    const favoriteButton = document.getElementById('favorite-button');
    const star = document.createElement('span');

    function setTextAndStar() {
      if (currentRestaurant.is_favorite === 'true') {
        favoriteButton.innerText = removeText;
        star.classList.add('star-active');
      } else {
        favoriteButton.innerText = addText;
        star.classList.remove('star-active');
      }
      favoriteButton.appendChild(star);
      star.classList.add("star-single");
    }

    setTextAndStar();

    favoriteButton.addEventListener('click', () => {
      currentRestaurant.is_favorite = currentRestaurant.is_favorite === 'true' ? 'false' : 'true';
      restaurantHandler.favoriteRestaurant(currentRestaurant, (error, result) => {
        if (error) {
          console.log(error)
          return
        }
        setTextAndStar();
      });
    })
  }

  /**
   * Initialize Google map, called from HTML.
   */
  window.initMap = () => {
    let loc = {
      lat: 40.722216,
      lng: -73.987501
    };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: currentRestaurant ? currentRestaurant.latlng : loc,
      scrollwheel: false
    });
    restaurantHandler.mapMarkerForRestaurant(currentRestaurant, map);
  }

  /**
   * Display error message on the page
   * 
   * @param {String} errorText 
   * @param {Number} code 
   */
  const displayError = (errorText = 'Something went wrong...', code) => {
    const restaurantContainer = document.getElementById('restaurant-container');
    const restaurantCuisine = document.getElementById('restaurant-cuisine');
    const errorParagraph = document.createElement('p');
    errorParagraph.id = "page-error";
    errorParagraph.innerText = errorText
    restaurantCuisine.innerText = code
    restaurantContainer.insertBefore(errorParagraph, restaurantContainer.firstChild);
  }

  /**
   * Get current restaurant from page URL.
   */
  const fetchRestaurantFromURL = (callback) => {
    if (currentRestaurant) { // restaurant already fetched!
      callback(null, currentRestaurant)
      return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
      const error = 'No restaurant id in URL';
      callback(error, null);
    } else {
      restaurantHandler.getRestaurantById(id, (error, restaurant) => {
        currentRestaurant = restaurant;
        if (!restaurant) {
          displayError('We\'re sorry but this restaurant do not exist :(', 404);
          console.error(error);
          return;
        }
        fillRestaurantHTML();
        createFavoriteButton();
        callback(null, restaurant)
      });
    }
  }

  /**
   * Create restaurant HTML and add it to the webpage
   */
  const fillRestaurantHTML = (restaurant = currentRestaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = currentRestaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = currentRestaurant.address;

    const pictureContainer = document.getElementById('restaurant-img');
    const sourceWebP = document.createElement('source');
    sourceWebP.setAttribute('srcset', restaurantHandler.imageUrlForRestaurant(restaurant) + '.webp');
    sourceWebP.setAttribute('type', 'image/webp');
    const image = document.createElement('img');
    pictureContainer.className = 'restaurant-img'
    image.className = 'restaurant-img'
    image.src = restaurantHandler.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt', currentRestaurant.name + ' restaurant')
    pictureContainer.append(sourceWebP);
    pictureContainer.append(image);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = currentRestaurant.cuisine_type;

    // fill operating hours
    if (currentRestaurant.operating_hours) {
      fillRestaurantHoursHTML();
    }
    // fill reviews
    restaurantHandler.getAllReviewsForRestaurant(restaurant.id, (error, reviews) => {
      if (error) console.warn(error);
      fillReviewsHTML(reviews);
    });

  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage.
   */
  const fillRestaurantHoursHTML = (operatingHours = currentRestaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  const fillReviewList = (reviews) => {
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(createReviewHTML(review));
    });
    return ul;
  }

  /**
   * Create all reviews HTML and add them to the webpage.
   */
  const fillReviewsHTML = (reviews = currentRestaurant.reviews) => {

    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }

    container.appendChild(fillReviewList(reviews));
  }

  /**
   * Create review HTML and add it to the webpage.
   */
  const createReviewHTML = (review) => {
    const li = document.createElement('li');

    const reviewTop = document.createElement('div');
    reviewTop.classList.add('review-top')
    li.appendChild(reviewTop)

    const name = document.createElement('span');
    name.innerHTML = review.name;
    name.classList.add('review-name')
    reviewTop.appendChild(name);

    const date = document.createElement('time');
    console.log(review.updatedAt)
    const dateTime = new Date(review.updatedAt);
    date.innerHTML = (dateTime.getMonth() + 1) + '/' + dateTime.getDate() + '/' + dateTime.getFullYear();
    reviewTop.appendChild(date);

    const rating = document.createElement('span');
    rating.innerHTML = `Rating: ${review.rating}`;
    rating.classList.add('review-rating')
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
  }

  /**
   * Add restaurant name to the breadcrumb navigation menu
   */
  const fillBreadcrumb = (restaurant = currentRestaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.text = currentRestaurant.name;
    a.href = '/currentRestaurant.html?id=' + currentRestaurant.id;
    a.setAttribute('aria-current', 'page');
    li.appendChild(a);
    breadcrumb.appendChild(li);
  }

  /**
   * Get a parameter by name from page URL.
   */
  const getParameterByName = (name, url) => {
    if (!url)
      url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      fillBreadcrumb();
    }
  });
})();