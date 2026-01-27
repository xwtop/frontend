import api from './api'

export const authAPI = {
    login(username, password) {
        return api.post('/api/v1/auth/login', { username, password })
    },

    register(username, password, real_name, email, email_code) {
        return api.post('/api/v1/auth/register', { username, password, real_name, email, email_code })
    },

    logout() {
        return api.post('/api/v1/auth/logout')
    }
}
