import api from './request'

export const authAPI = {
    login(username, password) {
        return api.post('/auth/login', { username, password })
    },

    register(username, password, real_name) {
        return api.post('/auth/register', { username, password, real_name })
    },

    logout() {
        return api.post('/auth/logout')
    },

    changePassword(oldPassword, newPassword, confirmPassword) {
        return api.post('/auth/changePassword', { oldPassword, newPassword, confirmPassword })
    }
}
