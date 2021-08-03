require('dotenv').config()

const path = require('path')
const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = 3000
const UAParser = require('ua-parser-js')

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const { cpuUsage } = require('process')
const { each } = require('lodash')

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
    return `/article/${doc.slug}`

  if(doc.type === 'event')
    return `/event/${doc.slug}`

  if(doc.type === 'guide')
    return `/guide/${doc.slug}`

  if(doc.type === 'category')
    return `/category/${doc.slug}`

  if(doc.type === 'about')
    return `/about`

  return '/'
}

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use(errorHandler())

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

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

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
  const home = await api.getSingle('home')
  const { results: categories } = await api.query(Prismic.Predicates.at( 'document.type', 'category' ),
    {
      fetchLinks:
      [
        'article.image',
        'article.title',
        'event.image',
        'event.title',
        'guide.image',
        'guide.title'
      ]
    }
  )

  res.render('pages/home',
  {
    ...defaults,
    home,
    categories,
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

app.get('/category/:uid', async (req, res) =>
{
  const api =  await initApi(req)
  const defaults = await handleRequest(api)
  const category = await api.getByUID
  (
    'category',
    req.params.uid,
    { fetchLinks: 'category.title' }
  )
  //const home = await api.getSingle('home')
  //const { results: s } = await api.query(Prismic.Predicates.at( 'document.type', 'collection' ),
  //  { fetchLinks: ['project.image', 'project.title', 'project.description'] }
  //)

  res.render('pages/category',
  {
    ...defaults,
    category
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

  res.render('pages/article',
  {
    ...defaults,
    article
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

  res.render('pages/event',
  {
    ...defaults,
    event
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

  res.render('pages/guide',
  {
    ...defaults,
    guide
  })
})

app.listen(port, () =>
{
  console.log(`App listening at http://localhost:${port}`)
})
