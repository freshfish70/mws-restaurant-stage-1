/**
 * IDBHelper
 * 
 * A simple helper class for IDB databases
 */
export default class IDBHelper {
  /**
   * Init the class
   * 
   * @param {idb} idbDatabase 
   */
  constructor(idbDatabase) {
    this.database = idbDatabase;
  }

  /**
   * Delete data from objectstore
   * 
   * @param {string} objectStoreName 
   * @param {object} dataToStore 
   */
  delete(objectStoreName, key, mode = 'readwrite') {
    return this.database.then(function (db) {
      let tx = db.transaction(objectStoreName, mode);
      let restaurantStore = tx.objectStore(objectStoreName);

      return restaurantStore.delete(key)
        .catch(err => {
          console.error(err);
        });

    })
  }

  /**
   * Put data to objectstore
   * 
   * @param {string} objectStoreName 
   * @param {object} dataToStore 
   */
  put(objectStoreName, dataToStore, mode = 'readwrite') {
    return this.database.then(function (db) {
      let tx = db.transaction(objectStoreName, mode);
      let restaurantStore = tx.objectStore(objectStoreName);

      return restaurantStore.put(dataToStore)
        .catch(err => {
          console.error(err);
        });

    })
  }

  /**
   * Get a value by key
   * 
   * @param {string} objectStoreName 
   * @param {string} key 
   */
  get(objectStoreName, key) {
    return this.database.then(function (db) {
      let tx = db.transaction(objectStoreName);
      let restaurantStore = tx.objectStore(objectStoreName);

      return restaurantStore.get(parseInt(key))
        .then(data => {
          if (data === undefined || data === null) return null;
          return data;
        })
        .catch(err => {
          console.error(err);
        });

    })
  }

  /**
   * Get all items in objectstore by index and value
   * 
   * @param {String} objectStoreName 
   * @param {String} index 
   * @param {String|Number} value 
   */
  getByIndex(objectStoreName, index, value = null) {
    return this.database.then(function (db) {
      let tx = db.transaction(objectStoreName);
      let restaurantStore = tx.objectStore(objectStoreName);
      let storeIndex = restaurantStore.index(index);

      return storeIndex.getAll(value)
        .then(data => {
          if (data === undefined || data === null) return null;
          return data;
        })
        .catch(err => {
          console.error(err);
        });
    })
  }

  /**
   * Get all items from the objectstore
   * 
   * @param {string} objectStoreName 
   */
  getAll(objectStoreName) {
    return this.database.then(function (db) {
      let tx = db.transaction(objectStoreName);
      let restaurantStore = tx.objectStore(objectStoreName);

      return restaurantStore.getAll()
        .then((data) => {
          return data;
        })
        .catch(err => {
          console.error(err);
        });

    })
  }

  /**
   * Returns the promise IDB database
   */
  get rawDatabase() {
    return this.database;
  }

}
