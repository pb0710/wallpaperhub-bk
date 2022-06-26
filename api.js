import request from './utils.js'

export const search = params => request.get('https://wallhaven.cc/search', { params })

export const getDetail = url => request.get(url)
