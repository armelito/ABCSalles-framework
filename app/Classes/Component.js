import EventEmitter from 'events'
import each from 'lodash/each'

export default class Component extends EventEmitter
{
  constructor({ _element, _elements })
  {
    super()

    this.selector = _element
    this.selectorChildren = { ..._elements }

    this.create()
    this.addEventListeners()
  }

  create()
  {
    this.selector instanceof window.HTMLElement ? this.element = this.selector : this.element = document.querySelector(this.selector)

    this.elements = {}

    each(this.selectorChildren, (_entry, _key) =>
    {
      if(_entry instanceof window.HTMLElement || _entry instanceof window.NodeList || Array.isArray(_entry))
        this.elements[_key] = _entry

      else
        this.elements[_key] = document.querySelectorAll(_entry)

        if(this.elements[_key].length === 0)
          this.elements[_key] = null

        else if (this.elements[_key].length === 1)
          this.elements[_key] = document.querySelector(_entry)
    })
  }

  addEventListeners()
  {

  }

  removeEventListeners()
  {

  }
}
