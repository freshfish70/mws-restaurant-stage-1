var idb = require('idb');

/**
 * Initialize all objectstores in our app
 * Setup indexes
 * 
 */
let db = idb.open('restaurant', 1, function (upgradeDB) {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      var restaurantStore = upgradeDB.transaction.objectStore('restaurants');
      restaurantStore.createIndex('id', 'id');
  }
});

export default db;