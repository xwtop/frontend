import api from './request'

export const authAPI = {
    login(username, password) {
        return api.post('/auth/login', { username, password })
    },

    register(username, password, real_name, email, email_code) {
        return api.post('/auth/register', { username, password, real_name, email, email_code })
    },

    logout() {
        return api.post('/auth/logout')
    }
}
