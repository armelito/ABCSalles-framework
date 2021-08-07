
import each from 'lodash/each'

import Page from 'Classes/Page'


export default class Home extends Page
{
  constructor ()
  {
    super({
      id: 'home',
      element: '.home',
      elements:
      {
        wrapper: '.home__wrapper',
      }
    })
  }
}
