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
    return this.elements.length ? this.elements[0] : null
  }

  get last() {
    return this.elements.length ? this.elements[this.elements.length - 1] : null
  }

  index(index) {
    return this.elements[index] ? this.elements[index] : null
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

  html(string) {
    return this.each(el => {
      el.innerHTML = string
      return el
    })
  }

  text(string) {
    return this.each(el => {
      if (el.textContent !== undefined) el.textContent = string
      else el.innerText = string
      return el
    })
  }

  css(obj) {
    return this.each(el => {
      for (let rule in obj) {
        el.style[rule] = obj[rule]
      }
      return el
    })
  }

  addClass(classList) {
    return this.each(el => {
      classList.split(' ').forEach(string => {
        if (el.classList) el.classList.add(string)
        else el.className += ' ' + string
      })
      return classList
    })
  }

  removeClass(classList) {
    return this.each(el => {
      classList.split(' ').forEach(string => {
        if (el.classList) el.classList.remove(string)
        else
          el.className = el.className.replace(
            new RegExp(
              '(^|\\b)' + string.split(' ').join('|') + '(\\b|$)',
              'gi'
            ),
            ' '
          )
      })
      return classList
    })
  }

  toggleClass(classList) {
    return this.each(el => {
      classList.split(' ').forEach(string => {
        if (el.classList) {
          el.classList.toggle(string)
        } else {
          let classes = el.className.split(' ')
          let existingIndex = classes.indexOf(string)

          if (existingIndex >= 0) classes.splice(existingIndex, 1)
          else classes.push(string)

          el.className = classes.join(' ')
        }
      })
      return classList
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
