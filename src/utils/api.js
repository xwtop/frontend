import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        const message = error.response?.data?.message || error.message || '请求失败'
        return Promise.reject({ message, code: error.response?.status })
    }
)

export default api
