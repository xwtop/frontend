import request from './request'

export const dashboardAPI = {
    getStats() {
        return request.get('/dashboard/stats')
    },

    getUserTrend(days = 7) {
        return request.get('/dashboard/user-trend', { params: { days } })
    },

    getArticleTrend(days = 7) {
        return request.get('/dashboard/article-trend', { params: { days } })
    },

    getViewTrend(days = 7) {
        return request.get('/dashboard/view-trend', { params: { days } })
    },

    getCategoryStats(limit = 10) {
        return request.get('/dashboard/category-stats', { params: { limit } })
    },

    getHotArticles(limit = 10) {
        return request.get('/dashboard/hot-articles', { params: { limit } })
    },

    getActiveUsers(limit = 10) {
        return request.get('/dashboard/active-users', { params: { limit } })
    },

    getHourlyActivity() {
        return request.get('/dashboard/hourly-activity')
    }
}
