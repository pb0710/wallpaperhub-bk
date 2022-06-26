import axios from 'axios'

const request = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

export default request
