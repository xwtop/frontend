import request from './request'

export const articleLikeAPI = {
    toggleLike(data) {
        return request.post('/articleLike/toggle', data)
    },
    
    checkLike(data) {
        return request.post('/articleLike/check', data)
    },
    
    getArticleLikes(articleId, page = 1, pageSize = 10) {
        return request.get(`/articleLike/article/${articleId}`, {
            params: { page, pageSize }
        })
    },
    
    getUserLikes(userId, page = 1, pageSize = 10) {
        return request.get(`/articleLike/user/${userId}`, {
            params: { page, pageSize }
        })
    }
}
