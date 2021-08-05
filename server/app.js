require('dotenv').config()

const app = require('./config')
const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')
const each = require('lodash/each')
const apiEndpoint = process.env.PRISMIC_ENDPOINT
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const initApi = req =>
{
  return Prismic.getApi(apiEndpoint,
  {
    accessToken: accessToken,
    req: req
  })
}

const handleLinkResolver = doc =>
{
  if(doc.type === 'article')
    return `/article/${doc.uid}`

  if(doc.type === 'event')
    return `/event/${doc.uid}`

  if(doc.type === 'guide')
    return `/guide/${doc.uid}`

  if(doc.type === 'category')
    return `/c/${doc.uid}`

  if(doc.type === 'about')
    return `/about`

  if(doc.type === 'home')
    return '/'

  if(doc.isBroken)
    return '/not-found'

  return '/not-found'
}

app.use((req, res, next) =>
{
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'
  res.locals.link = handleLinkResolver
  res.locals.PrismicDOM = PrismicDOM

  next()
})

const handleRequest = async api =>
{
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    meta,
    navigation,
    preloader
  }
}

app.get('/', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle
  (
    'home',
    {
      fetchLinks:
      [
        'article.name',
        'article.image',
        'article.date',
        'event.name',
        'event.image',
        'event.date',
        'event.place'
      ]
    }
  )
  const thumbnail = await api.getByID(home.data.thumbnail_link.id)
  const guides = await api.getByID('YQk6hRAAACcAQQ77', { fetchLinks: 'guide.title' })

  res.render('pages/home',
  {
    ...defaults,
    home,
    guides,
    thumbnail
  })
})

app.get('/about', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about',
  {
    ...defaults,
    about
  })
})

app.get('/c/:uid', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const category = await api.getByUID
  (
    'category',
    req.params.uid,
    { fetchLinks:
      [
        'category.title',
        'article.image',
        'article.name',
        'article.date',
        'event.image',
        'event.name',
        'event.date',
        'event.place',
        'guide.image',
        'guide.title'
      ]
    }
  )
  const thumbnail = await api.getByID(category.data.thumbnail_link.id)

  if(category)
    res.render('pages/category',
    {
      ...defaults,
      category,
      thumbnail
    })

  else
    res.render('pages/notFound',
    {
      ...defaults,
    })
})

app.get('/article/:uid', async (req, res) =>
{
  //console.log(req.params.uid, REQUEST)
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const article = await api.getByUID
  (
    'article',
    req.params.uid,
    { fetchLinks: 'article.title' }
  )

  console.log(article, article.data.body)

  if(article)
    res.render('pages/article',
    {
      ...defaults,
      article
    })

  else
    res.render('pages/notFound',
    {
      ...defaults,
    })
})

app.get('/event/:uid', async (req, res) =>
{
  //console.log(req.params.uid, REQUEST)
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const event = await api.getByUID
  (
    'event',
    req.params.uid,
    { fetchLinks: 'event.title' }
  )

  console.log(event, event.data.body)

  if(event)
    res.render('pages/event',
    {
      ...defaults,
      event
    })

  else
    res.render('pages/notFound',
    {
      ...defaults,
    })
})

app.get('/guide/:uid', async (req, res) =>
{
  //console.log(req.params.uid, REQUEST)
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const guide = await api.getByUID
  (
    'guide',
    req.params.uid,
    { fetchLinks: 'guide.title' }
  )

  console.log(guide, guide.data.body)

  if(guide)
    res.render('pages/guide',
    {
      ...defaults,
      guide
    })

  else
    res.render('pages/notFound',
    {
      ...defaults,
    })
})

app.get('/not-found', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/notFound',
  {
    ...defaults
  })
})

app.use(async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)

  res.status(404).render('pages/notFound',
  {
    ...defaults
  })
})

app.listen(app.get('port'), () =>
{
  console.log(`App listening at http://localhost:${app.get('port')}`)
})
