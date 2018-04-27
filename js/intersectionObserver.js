let imageIntersectOberserver = () => {

  // What to track, an array of items
  let track;
  //Observer
  let observer;
  //Observer options
  let options = {
    root: null, // null defaults to Viewport 
    rootMargin: '20px 0px 0px 0px', // Extend detection are on top by 20px so its get detected just before we see it
    threshold: 0 // set to 0 so only 1px visibility will trigger the intersect function
  };

  /**
   * 
   * 
   * @param {element: img/source} image 
   */
  function setSrc(imageNode) {
    if (imageNode.children > 0) {
      for (let image of imageNode.children) {
        moveDatasetToSrc(image);
      }
    } else {
      moveDatasetToSrc(imageNode);
    }
  }

  /**
   * Move dataset-srcset/src to real srcset/src of element
   * 
   * @param {element: img/source} image 
   */
  function moveDatasetToSrc(image) {
    if (image.dataset && image.dataset.srcset) {
      image.srcset = image.dataset.srcset;
    }
    if (image.dataset && image.dataset.src) {
      image.src = image.dataset.src;
    }
  }

  /**
   * Callback method for intersection detection
   * 
   * @param {intersectionEntry} changes 
   * @param {IntersectionObserver} observer 
   */
  function change(intersectionEntry, observer) {
    intersectionEntry.forEach(entry => {
      if (!entry.isIntersecting) return
      setSrc(entry.target)
      observer.unobserve(entry.target);
    });
  }

/**
 * Create the IntersectionObserver
 * 
 * @param {Object} custom 
 */
  function create(custom = {}) {
    if (!"IntersectionObserver" in window) return
    observer = new IntersectionObserver(custom.change || change, custom.options || options);
    track = custom.track || document.querySelectorAll('source, img')
    Array.prototype.map.call(track, function (element) {
      observer.observe(element);
    });

  }

  return  Object.freeze({
    create
  })

}

export default imageIntersectOberserver();