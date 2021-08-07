import Component from 'Classes/Component'

export default class AsyncLoad extends Component
{
  constructor({ _element })
  {
    super({ _element })

    this.createObserver()
  }

  createObserver()
  {
    this.observer = new window.IntersectionObserver(_entries =>
    {
      _entries.forEach(_entry =>
      {
        if(_entry.isIntersecting)
        {
          if(!this.element.src)
          {
            this.element.src = this.element.getAttribute('data-src')
            this.element.onload = _ =>
            {
              this.element.classList.add('loaded')
            }
          }

          else
          {
            this.element.classList.add('loaded')
          }
        }

        else
        {
          this.element.classList.remove('loaded')
        }
      })
    })

    this.observer.observe(this.element)
  }
}
