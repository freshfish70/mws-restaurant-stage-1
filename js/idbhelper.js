
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

      return restaurantStore.get(key)
      .then((data) => {
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
