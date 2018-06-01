function alert(
  text,
  {
    classes = '',
    id = 'alert-box',
    bindTo = undefined,
    showFor = undefined,
    transition = 'all 1s ease'
  } = {}
) {
  this.text = text
  this.bindTo = bindTo
  this.classes = classes
  this.id = id
  this.showForTime = showFor
  this.transition = transition

  this.elem = document.createElement('div')
  this.elem.id = this.id
  this.elem.classList.add(...this.classes)
  this.elem.innerHTML = this.text
  this.elem.style.transition = this.transition

  if (!this.bindTo) {
    document.body.appendChild(this.elem)
  } else {
    this.bindTo.appendChild(this.elem)
  }

  if (this.showForTime) {
    this.showFor(this.showForTime)
  }
}

alert.prototype.hide = function() {
  this.elem.style.opacity = 0
}

alert.prototype.show = function(
) {
    this.elem.style.opacity = 1    
}

alert.prototype.showFor = function(time) {
  this.show()
  setTimeout(() => {
    this.hide()
  }, time)
}

export default alert
