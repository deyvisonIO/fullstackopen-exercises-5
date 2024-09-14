import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data, error => error.response.data)
}


const create = (title, author, url, userToken) => {
    const request = axios.post(baseUrl, { title, author, url }, { headers: { "Authorization": "Bearer " + userToken } })
  return request.then(response => response.data, error => error.response.data)
}


export default { getAll, create }
