import Router from '@koa/router'
import { parse } from 'node-html-parser'
import { getDetail, search } from './api.js'

function domStyleToObj(str) {
  const list = str.split(';')
  return list.reduce((pre, cur) => {
    const [key, value] = cur.split(':')
    pre[key] = value
    return pre
  }, {})
}

function removePixel(styleObj) {
  Object.keys(styleObj).forEach(key => {
    const [num] = styleObj[key].split('px')
    styleObj[key] = Number(num)
  })
  return styleObj
}

function getThumbnailSize(elem) {
  const elemStyle = elem.getAttribute('style')
  const styleObj = domStyleToObj(elemStyle)
  return removePixel(styleObj)
}

const getOriginSize = elem => elem.querySelector('.wall-res').firstChild.toString()
const getStarNum = elem => Number(elem.querySelector('.wall-favs').firstChild.toString())
const getImgId = elem => elem.getAttribute('data-wallpaper-id')
const getThumbnail = elem => elem.querySelector('> img').getAttribute('data-src')
const getPreview = elem => elem.querySelector('> a').getAttribute('href')
const parseFigureList = item => ({
  id: getImgId(item),
  thumbnail: getThumbnail(item),
  preview: getPreview(item),
  size: getOriginSize(item),
  thumbnailSize: getThumbnailSize(item),
  star: getStarNum(item)
})

const handleSearch = async (ctx, next) => {
  const { data } = await search(ctx.query)
  const root = parse(data)
  const thumbsBoxEle = root.querySelector('.thumb-listing-page > ul')
  const figureListEle = thumbsBoxEle.querySelectorAll('> li > figure')
  const result = figureListEle.map(parseFigureList)
  ctx.body = result
  await next()
}

const handleGetDetail = async (ctx, next) => {
  const { previewUrl, ...rest } = ctx.query
  const { data } = await getDetail(previewUrl)
  const root = parse(data)
  const imgEle = root.querySelector('#wallpaper')
  const url = imgEle.getAttribute('src')
  ctx.body = { ...rest, url }
  await next()
}

const router = new Router()
router.get('/search', handleSearch).get('/get_detail', handleGetDetail)

export default router
