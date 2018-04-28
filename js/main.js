import restaurantHandler from './restaurantHandler'
import imageIntersectObserver from './intersectionObserver'
import maps from './googleMaps'

let main = (function () {

  let allRestaurants = []
  let allNeighborhoods = []
  let allCuisines = []
  let map = null;
  let mapMarkers = []

  let neighborhoodsSelect = document.getElementById('neighborhoods-select');
  let cuisinesSelect = document.getElementById('cuisines-select');

  neighborhoodsSelect.onchange = () => {
    updateRestaurants();
  }
  cuisinesSelect.onchange = () => {
    updateRestaurants();
  }

  /**
   * Start fetching of restaurants neighborhood and cuisines
   */
  function init() {
    updateRestaurants();
    fetchNeighborhoods();
    fetchCuisines();
  }


  /**
   * Fetch all neighborhoods and set their HTML.
   */
  const fetchNeighborhoods = () => {
    restaurantHandler.getAllNeighborhoods((error, neighborhoods) => {
      if (error) { // Got an error
        console.error(error);
      } else {
        allNeighborhoods = neighborhoods;
        fillNeighborhoodsHTML();
      }
    });
  }



  /**
   * Set neighborhoods HTML.
   */
  const fillNeighborhoodsHTML = (neighborhoods = allNeighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
      const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      select.append(option);
    });
  }

  /**
   * Fetch all cuisines and set their HTML.
   */
  const fetchCuisines = () => {
    restaurantHandler.getAllCuisines((error, cuisines) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        allCuisines = cuisines;
        fillCuisinesHTML(cuisines);
      }
    });
  }

  /**
   * Set cuisines HTML.
   */
  const fillCuisinesHTML = (cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    });
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
      center: loc,
      scrollwheel: false
    });

    addMarkersToMap(allRestaurants);
  }

  /**
   * Update page and map for current restaurants.
   */
  const updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    restaurantHandler.getRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        resetRestaurants();
        allRestaurants = restaurants;
        restaurants.length > 0 ? fillRestaurantsHTML(restaurants) : informUser('Sorry, we can\'t find any restaurants...');
        imageIntersectObserver.create({
          track: document.querySelectorAll('source, img')
        });

      }
    })
  }

  /**
   * Display error message on the page
   * 
   * @param {String} errorText 
   */
  const informUser = (errorText = 'Something went wrong...') => {
    const restaurantContainer = document.getElementById('restaurants-list');
    const errorParagraph = document.createElement('p');
    errorParagraph.id = "page-error";
    errorParagraph.innerText = errorText
    restaurantContainer.insertAdjacentElement('beforebegin', errorParagraph);
  }

  /**
   * Clear current restaurants, their HTML and remove their map markers.
   */
  const resetRestaurants = () => {
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    mapMarkers.forEach(m => m.setMap(null));
    mapMarkers = [];
  }

  /**
   * Create all restaurants HTML and add them to the webpage.
   */
  const fillRestaurantsHTML = (restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
      ul.append(createRestaurantHTML(restaurant));
    });

  }

  /**
   * Create restaurant HTML.
   */
  const createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');

    const picture = document.createElement('picture');
    const sourceWebP = document.createElement('source');
    sourceWebP.setAttribute('data-srcset', restaurantHandler.imageUrlForRestaurant(restaurant) + '.webp');
    sourceWebP.setAttribute('type', 'image/webp');
    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.setAttribute('alt', restaurant.name + ' restaurant')
    image.setAttribute('data-src', restaurantHandler.imageUrlForRestaurant(restaurant) + '.jpg');

    picture.append(sourceWebP);
    picture.append(image);
    li.append(picture);

    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.setAttribute('aria-label', 'View ' + restaurant.name + ' details')
    more.href = restaurantHandler.urlForRestaurant(restaurant);
    li.append(more)

    return li
  }

  /**
   * Add markers for current restaurants to the map.
   */
  const addMarkersToMap = (restaurants) => {
    if (!map) return
    restaurants.forEach(restaurant => {
      // Add marker to the map
      const marker = restaurantHandler.mapMarkerForRestaurant(restaurant, map);
      google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url
      });
      mapMarkers.push(marker);
    });
  }

  return {
    init
  };


})();


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  main.init();
});