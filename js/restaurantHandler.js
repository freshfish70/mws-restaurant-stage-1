import idbhelper from './idbhelper'
import DBHelper from './dbhelper.js'
import restaurantDB from './database'
import restaurantHelper from './restaurantHelper'
import apiHelper from './apiHelper'

/**
 * 
 * @param {restaurantHelper} api 
 */
let restaurantHandler = function (api) {

  const idb = new idbhelper(restaurantDB);

  /**
   * Time of last fetch
   */
  let lastFetch = 0;

  /**
   * Time to pass before next request will fire
   * @param {Number} dataToStore
   */
  let timer = 1 // 1 minutes


  /**
   * Get all items from IDB store with specified name
   * 
   * @param {string} storeName 
   */
  function getAllFromIDBStore(storeName) {
    return idb.getAll(storeName).then(results => {
      if (results.length == 0) return Promise.reject('Empty')
      return results;
    });
  }

  /**
   * Get an item from IDB store with name and id of item
   * 
   * @param {string} storeName 
   * @param {number} id 
   */
  function getByIdFromIDBStore(storeName, id) {
    return idb.get(storeName, id).then(results => {
      return results;
    });
  }

  /**
   * Get an item from IDB store with name and id of item
   * 
   * @param {string} storeName 
   * @param {number} id 
   */
  function getByIndexFromIDBStore(storeName, index) {
    return idb.getByIndex(storeName, index).then(results => {
      return results;
    });
  }

  /**
   * Check if our timer has reached
   * its countdown time
   */
  function fetchTimerPassed() {

    let date = new Date();
    date.setMinutes(date.getMinutes() - timer);

    if (date.getTime() > lastFetch) {
      lastFetch = Date.now();
      return true
    }

    return false

  }

  /**
   * Put items into IDB store 
   * 
   * @param {String} storeName 
   * @param {Array} arrayOfItems 
   */
  function putItemsToIDB(storeName, arrayOfItems) {
    arrayOfItems.forEach(element => {
      idb.put(storeName, element)
    });
  }


  /**
   * Fetch all restaurants from server
   * 
   * @param {Function} callback 
   */
  function fetchAll(callback) {

    if (fetchTimerPassed()) {
      api.getAllRestaurants((error, restaurants) => {
        if (error) return callback(error, null);
        putItemsToIDB('restaurants', restaurants);
        callback(null, restaurants);
      })
    }
  }

  /**
   * Fetch item from server by id
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function fetchById(id, callback) {

    api.getRestaurantByID(id, (error, restaurant) => {
      if (error) return callback(error, null);
      putItemsToIDB('restaurants', [restaurant]);
      callback(null, restaurant);
    })
  }

  /**
   * Get all restaurants
   * 
   * @param {Function} callback
   */
  function getAllRestaurants(callback) {

    getAllFromIDBStore('restaurants')
      .then((restaurants) => {
        callback(null, restaurants);
        callback = undefined;
      })
      .catch((error) => {
        console.log('Failed to get restaurants from cache: ' + error);
      }).finally(() => {
        fetchAll((error, restaurants) => {
          if (error) {
            return callback(error, null);
          }
          callback ? callback(null, restaurants) : undefined;
        });
      })

  }

  /**
   * Returns a restaurants by its ID
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function getRestaurantById(id, callback) {

    getByIdFromIDBStore('restaurants', id)
      .then((restaurant) => {
        if (!restaurant) throw 'no records'
        callback(null, restaurant);
        callback = undefined;
      })
      .catch((error) => {
        console.log('Failed to get restaurants by id from cache: ' + error);
      }).finally(() => {
        fetchById(id, (error, restaurant) => {
          if (error) {
            callback ? callback(error, null) : undefined;
            return
          }
          callback ? callback(null, restaurant) : undefined;
        });
      })

  }

  /**
   * Filter out the cuisines types
   * 
   * This is much easier/less code then creating a cursor to itterate over IDB
   */
  function filterAllCuisines(restaurants) {

    const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
    return cuisines.filter((v, i) => cuisines.indexOf(v) == i)

  }

  /**
   * Returns an array of every type of cuisine
   * 
   * @param {Function} callback 
   */
  function getAllCuisines(callback) {

    getAllFromIDBStore('restaurants').then(restaurants => {
      callback(null, filterAllCuisines(restaurants));
    }).catch(err => {
      console.warn('Failed too get cuisines from idb, fetching')
      DBHelper.fetchCuisines(callback);
    })

  }

  /**
   * Filter out neighborhoods and removes duplicates
   * 
   * taken from DBHELPER
   */
  function filterAllNeighborhoods(restaurants) {
    const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
    return neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
  }

  /**
   * Gets all neighborhoods
   * 
   * @param {Function} callback 
   */
  function getAllNeighborhoods(callback) {

    getAllFromIDBStore('restaurants').then(restaurants => {
      callback(null, filterAllNeighborhoods(restaurants));
    }).catch(err => {
      console.warn('Failed too get neighborhoods from idb, fetching')
      DBHelper.fetchNeighborhoods(callback);
    })

  }

  /**
   * Filters restaurants by cuisines and neighborhood
   * 
   * @param {String} cuisine 
   * @param {String} neighborhood 
   * @param {Array} restaurants 
   */
  function filterRestaurantByCuisineNeighborhood(cuisine, neighborhood, restaurants) {
    let results = restaurants
    if (cuisine != 'all') { // filter by cuisine
      results = results.filter(r => r.cuisine_type == cuisine);
    }
    if (neighborhood != 'all') { // filter by neighborhood
      results = results.filter(r => r.neighborhood == neighborhood);
    }

    return results;
  }
  /**
   * Gets all restaurants with the type of cuisine and neighborhood
   * 
   * @param {String} cuisine 
   * @param {String} neighborhood 
   * @param {Function} callback 
   */
  function getRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {

    getAllFromIDBStore('restaurants').then(restaurants => {
      callback(null, filterRestaurantByCuisineNeighborhood(cuisine, neighborhood, restaurants));
      callback = undefined;
    }).catch(err => {
      console.warn('Failed too get restaurants cuisines and neighborhoods from idb, fetching');
    }).finally(() => {
      if (!fetchTimerPassed()) return
      DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) return callback(error, null);
        putItemsToIDB('restaurants', restaurants);
        callback ? callback(null, filterRestaurantByCuisineNeighborhood(cuisine, neighborhood, restaurants)) : undefined;
      });
    })

  }

  function getAllReviewsForRestaurant(id, callback) {

    getAllFromIDBStore('reviews').then(reviews => {
      callback(null, reviews);
      callback = undefined;
    }).catch(err => {
      console.warn('Failed too get reviews from idb, fetching');
    }).finally(() => {
      api.getRestaurantReviews(id, (error, reviews) => {
        if (error) return callback(error, null);
        putItemsToIDB('reviews', reviews);
        callback ? callback(null, reviews) : undefined;
      });
    })

  }

  /**
   * Restaurant page URL.
   */
  function urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  function imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  function mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

  /**
   * Returns a frozen object to prevent
   * modification of the object.
   */
  return Object.freeze({
    getAllCuisines,
    getAllNeighborhoods,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantByCuisineAndNeighborhood,
    urlForRestaurant,
    imageUrlForRestaurant,
    mapMarkerForRestaurant,
    getAllReviewsForRestaurant
  })

}

export default restaurantHandler(
  restaurantHelper(apiHelper({
    url: 'http://127.0.0.1:1337/'
  }))
);