var idb = require('idb');

let db;

/**
 * Reject IDB if we dont have service worker avaiable.
 */
if (!'serviceWorker' in navigator) {
  db = null
} else {

  /**
 * Initialize all objectstores in our app
 * Setup indexes
 * 
 */
  db = idb.open('restaurant', 3, function (upgradeDB) {
    switch (upgradeDB.oldVersion) {
      case 0:
        upgradeDB.createObjectStore('restaurants', {
          keyPath: 'id'
        });
        let restaurantStore = upgradeDB.transaction.objectStore('restaurants');
        restaurantStore.createIndex('id', 'id');
      case 1:
        let restaurantStore2 = upgradeDB.transaction.objectStore('restaurants');
        restaurantStore2.createIndex('cuisine_type', 'cuisine_type');
        restaurantStore2.createIndex('neighborhood', 'neighborhood');
      case 2:
        upgradeDB.createObjectStore('reviews', {
          keyPath: 'id'
        })
        let reviewStore = upgradeDB.transaction.objectStore('reviews');
        reviewStore.createIndex('restaurant_id', 'id')
        let restaurantStore3 = upgradeDB.transaction.objectStore('restaurants');
        restaurantStore3.createIndex('is_favorite', 'is_favorite');

    }
  });
}


export default db;