
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
   * @param {string} databaseName 
   * @param {object} dataToStore 
   */
  put(databaseName, dataToStore) {
    this.database.then(function (db) {
      let tx = db.transaction(databaseName, 'readwrite');
      let restaurantStore = tx.objectStore(databaseName);

      let a = restaurantStore.put(dataToStore)
      .then(() => {
        console.log('Successfully put data to: ' + databaseName);
      })
      .catch(e => {
        console.error(e);
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
