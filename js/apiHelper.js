/**
 * Helper functions for creating fetch requests
 * 
 * @param {Object} config {url: <base api url>}
 */
let apiHelper = function apiHelper(config) {

  const DEFAULT_GET = {
    method: 'GET'
  }

  const DEFAULT_POST = {
    method: 'POST'
  }

  const DEFAULT_PUT = {
    method: 'PUT'
  }

  const DEFAULT_DELETE = {
    method: 'DELETE'
  }


  /**
   * Executes a request with Fetch
   * 
   * @param {String} type - get, post, put, delete
   * @param {Object} options - {url: <string>, options: FETCH api INIT OPTIONS}
   * @param {Function} callback 
   */
  function execute(type, options = {}, callback, ) {
    fetch(createRequest(type, options))
      .then(function (response) {
        if (response.ok) {
          return response
        }
        return Promise.reject(response.status + ": " + response.statusText)
      })
      .then(response => response.json())
      .then(function (data) {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, null);
      });


  }

  /**
   * Returns a request object based on type and options
   * 
   * @param {String} type 
   * @param {Object} options 
   * @returns {Request}
   */
  function createRequest(type, options) {
    switch (type) {
      case 'get':
        return get(options);
        break;
      case 'post':
        return post(options);
        break;
      case 'delete':
        return del(options);
        break;
      case 'put':
        return put(options);
        break;
    }
  }

  /**
   * Create and return a new GET request with
   * options
   * 
   * @param {Object} config - {url: <string>, options: FETCH api INIT OPTIONS}
   */
  function get(config) {
    return new Request(getFullApiUrl(config.url), { ...DEFAULT_GET,
      ...config.options
    })
  }

  /**
   * Create and return a new POST request with
   * options
   * 
   * @param {Object} config - {url: <string>, options: FETCH api INIT OPTIONS}
   */
  function post(config) {
    return new Request(getFullApiUrl(config.url), { ...DEFAULT_POST,
      ...config.options
    })
  }

  /**
   * Create and return a new DELETE request with
   * options
   * 
   * @param {Object} config - {url: <string>, options: FETCH api INIT OPTIONS}
   */
  function del(config) {
    return new Request(getFullApiUrl(config.url), { ...DEFAULT_DELETE,
      ...config.options
    })
  }

  /**
   * Create and return a new PUT request with
   * options
   * 
   * @param {Object} config - {url: <string>, options: FETCH api INIT OPTIONS}
   */
  function put(config) {
    return new Request(getFullApiUrl(config.url), { ...DEFAULT_PUT,
      ...config.options
    })
  }

  /**
   * Combine endpoint with base url for the API
   * 
   * @param {String} endpoint 
   */
  function getFullApiUrl(endpoint) {
    return config.url + endpoint;
  }

  return {
    execute,
    getFullApiUrl,
  }
}

export default apiHelper;