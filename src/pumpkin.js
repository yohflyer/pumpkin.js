class Pumpkin {
  constructor(string, scope = document) {
    this.fetchElements(string, scope)
  }

  fetchElements(string = this.selector, scope = this.scope) {
    this.selector = string
    this.scope = scope
    this.elements = [...this.scope.querySelectorAll(this.selector)]
    return this.elements
  }

  each(cb = () => null, alwaysArray = false) {
    if (this.elements.length) {
      return this.elements.length > 1 || alwaysArray
        ? this.elements.map(cb)
        : this.elements.map(cb)[0]
    }
    return console.warn(
      `Could not find DOM elements matching selector '${this.selector}'.`
    )
  }

  get first() {
    return this.elements[0]
  }

  get last() {
    return this.elements[this.elements.length - 1]
  }

  get children() {
    return this.each(el => {
      let children = []
      for (let i = el.children.length; i--; ) {
        if (el.children[i].nodeType !== 8) children.unshift(el.children[i])
      }
      return children
    })
  }

  get siblings() {
    return this.each(el => {
      let siblings = Array.prototype.slice.call(el.parentNode.children)
      for (let i = siblings.length; i--; ) {
        if (siblings[i] === el) {
          siblings.splice(i, 1)
          break
        }
      }
      return siblings
    })
  }

  contains(child) {
    return this.each(function(el) {
      return el !== child && el.contains(child)
    })
  }

  empty() {
    return this.each(el => {
      while (el.firstChild) el.removeChild(el.firstChild)
      return el
    })
  }

  show() {
    return this.each(el => {
      el.style.display = ''
      return el
    })
  }

  hide() {
    return this.each(el => {
      el.style.display = 'none'
      return el
    })
  }

  toggle() {
    return this.each(el => {
      el.style.display = el.style.display === 'none' ? '' : 'none'
      return el
    })
  }

  remove() {
    return this.each(el => {
      el.parentNode.removeChild(el)
      return el
    })
  }

  static trim(string) {
    return string.replace(/^\s+|\s+$/g, '')
  }

  static ready(cb) {
    if (document.readyState !== 'loading') cb()
    else if (document.addEventListener)
      document.addEventListener('DOMContentLoaded', cb)
    else
      document.attachEvent('onreadystatechange', () => {
        if (document.readyState === 'complete') cb()
      })
    return cb
  }
}

export default Pumpkin
