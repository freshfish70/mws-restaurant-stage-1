window.onload = function () {

  if (!navigator.onLine) return;

  let script = document.createElement('script')
  script.setAttribute('async', '');
  script.setAttribute('defer', '');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBHLLkh3NeC0pmKVNuxKFZfsO6V-yq5lq4&libraries=places&callback=initMap'
  document.body.appendChild(script);
}