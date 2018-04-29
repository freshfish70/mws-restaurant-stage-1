let offlineNotice = function offlineNotice(){
  if (navigator.onLine) return
  const offlineElement = document.createElement('div');
  offlineElement.addEventListener('click', (event) => {
    document.body.removeChild(offlineElement)
  })
  const offlineText = "You're currently offline.";
  const close = document.createElement('button');
  close.textContent = '✖'; //UTF-8 symbol

  offlineElement.id = "offline-notice";
  offlineElement.textContent = offlineText;
  offlineElement.appendChild(close);
  document.body.appendChild(offlineElement);
}

export default offlineNotice();