import each from 'lodash/each'

import Preloader from 'Components/Preloader'

import Home from 'Pages/Home'
class App
{
  constructor()
  {
    this.createContent()
    this.createPreloader()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()

    this.onResize()
    this.update()
  }

  createPreloader()
  {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createContent()
  {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages()
  {
    this.pages =
    {
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()

    this.onResize()
  }

  onPreloaded()
  {
    this.preloader.destroy()
    this.page.show()
  }

  onPopState()
  {
    this.onChange({ _url: window.location.pathname, push: false })
  }

  async onChange({ _url, _push = true })
  {
    await this.page.hide()

    const request = await window.fetch(_url)

    if(request.status === 200)
    {
      const html = await request.text()
      const div = document.createElement('div')

      if(_push) window.history.pushState({}, '', _url)

      div.innerHTML = html
      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()

      this.addLinkListeners()
      this.onResize()
    }
    else
    {
      this.onChange({ _url: '/' })
    }
  }

  update()
  {
    if(this.page && this.page.update)
      this.page.update()

    window.requestAnimationFrame(() =>
    {
      this.update()
    })
  }
  /*
  *   LISTENERS
  *
  */
  onResize()
  {
    if(this.page && this.page.onResize)
      this.page.onResize()
  }

  addEventListeners ()
  {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners ()
  {
    const links = document.querySelectorAll('a')

    each(links, (_link) =>
    {
      _link.onclick = event =>
      {
        event.preventDefault()

        const { href } = _link

        this.onChange({ _url: href })
      }
    })
  }
}

new App()
