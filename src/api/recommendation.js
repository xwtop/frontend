import request from './request'

export const recommendationAPI = {
    getPersonalizedRecommendations() {
        return request.get('/recommendation/personalized')
    }
}
