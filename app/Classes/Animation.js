import Component from 'Classes/Component'
import each from 'lodash/each'

export default class Animation extends Component
{
  constructor ({ _element, _elements })
  {
    super(
      {
        _element,
        _elements
      }
    )

    this.separateElements()
  }

  separateElements()
  {
    //if(this.element.attributes.length > 1 && this.element.attributes[1].value === "link")
    //  this.createHover(this.element)

    //else if(this.element.attributes[0].value === "gallery-section")
    //  this.createHover(this.element)

    //else
    //  this.createObserver(this.element)
  }


  createObserver()
  {
    this.observer = new IntersectionObserver(_entries =>
    {
      _entries.forEach(_entry =>
      {
        _entry.isIntersecting ? this.animateIn() : this.animateOut()
      })
    })

    //each(this.elementsToObserve, elementToObserve =>
    //{
    //  elementToObserve.length != 0 ? this.observer.observe(elementToObserve) : ''
    //})
  }

  createHover(_element)
  {
    _element.addEventListener('mouseenter', event =>
    {
      this.animateIn(event)
      //this.$cursor.classList.add('mouse-enter')
    })
    // Hover out
    _element.addEventListener('mouseleave', event =>
    {
      this.animateOut(event)
      //this.$cursor.classList.remove('mouse-enter')
    })
  }

  animateIn()
  {
    // Overwrited in animations files
  }

  animateOut()
  {
    // Overwrited in animations files
  }

}
