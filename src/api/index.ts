import axios from 'axios'
import { getToken } from '../lib/helper/authentication'

const host = window.location.hostname === 'clinicmanagementsystem.vercel.app' ? '' : 'http://localhost:4000'

export const apiHost = `${host}/api`

export const apiClient = axios.create({
  baseURL: apiHost
})

apiClient.interceptors.request.use(
  (config) => {
    // Use the getToken function to retrieve the token
    const token = getToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
