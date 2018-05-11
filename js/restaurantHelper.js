/**
 * 
 * @param {apiHelper} api 
 */
const restaurantHelper = function restaurantHelper(api) {

  /* GET */

  /**
   * Get all restaurants
   * 
   * @param {Function} callback 
   */
  function getAllRestaurants(callback) {
    api.execute('get', {
      url: 'restaurants'
    }, callback);
  }

  /**
   * Get all forvorite restarants
   * 
   * @param {Function} callback 
   */
  function getAllFavorites(callback) {
    api.execute('get', {
      url: 'restaurants/?is_favorite=true'
    }, callback);
  }

  /**
   * Get restaurant by ID
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function getRestaurantByID(id, callback) {
    api.execute('get', {
      url: `restaurants/${id}`
    }, callback);
  }

  /**
   * Get all reviews
   * 
   * @param {Function} callback 
   */
  function getAllReviews(callback) {
    api.execute('get', {
      url: 'reviews'
    }, callback);
  }

  /**
   * Get a review by id
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function getReviewById(id, callback) {
    api.execute('get', {
      url: `reviews/${id}`
    }, callback);
  }

  /**
   * Get all reviews for a restaurant
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function getRestaurantReviews(id, callback) {
    api.execute('get', {
      url: `reviews/?restaurant_id=${id}`
    }, callback);
  }

  /* POST */

  /**
   * Create a reivew for a restaurant
   * 
   * params: {
              "restaurant_id": <restaurant_id>,
              "name": <reviewer_name>,
              "rating": <rating>,
              "comments": <comment_text>
      }
   * 
   * @param {Object} params 
   * @param {Function} callback 
   */
  function createReview(params = {}, callback) {

    const data = {
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json'
      }
    }

    api.execute('post', {
      url: `reviews`,
      options: data
    }, callback);
  }

  /* PUT */

  /**
   * Favorite a restaurant by ID
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function favoriteRestaurantByID(id, callback) {
    api.execute('put', {
      url: `restaurants/${id}/?is_favorite=true`
    }, callback);
  }

  /**
   * Unfavorite a restaurant by ID
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function unFavoriteRestaurantByID(id, callback) {
    api.execute('put', {
      url: `restaurants/${id}/?is_favorite=false`
    }, callback);
  }

  /**
   * Update a restaurant view by its id
   * 
   * params: {
              "name": <reviewer_name>,
              "rating": <rating>,
              "comments": <comment_text>
      }
   * 
   * @param {Number} id 
   * @param {Object} params 
   * @param {Function} callback 
   */
  function updateRestaurantViewByID(id, params = {}, callback) {
    api.execute('put', {
      url: `reviews/${id}`
    }, callback);
  }

  /* DELETE */

  /**
   * Delete a review by its id
   * 
   * @param {Number} id 
   * @param {Function} callback 
   */
  function deleteReviewByID(id, callback) {
    api.execute('delete', {
      url: `reviews/${id}`
    }, callback);
  }

  return Object.freeze({
    getAllRestaurants,
    getRestaurantByID,
    getAllFavorites,
    getAllReviews,
    getRestaurantReviews,
    getReviewById,
    createReview,
    favoriteRestaurantByID,
    unFavoriteRestaurantByID,
    updateRestaurantViewByID,
    deleteReviewByID
  });
}


export default restaurantHelper;