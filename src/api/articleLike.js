import request from './request'

export const articleLikeAPI = {
    toggle(articleId) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return request.post('/articleLike/toggle', {
            article_id: articleId,
            user_id: userInfo.userId
        })
    },
    
    check(articleId) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return request.post('/articleLike/check', {
            article_id: articleId,
            user_id: userInfo.userId
        })
    },
    
    batchCheck(articleIds) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return request.post('/articleLike/batch-check', {
            article_ids: articleIds,
            user_id: userInfo.userId
        })
    },
    
    getArticleLikes(articleId, page = 1, pageSize = 10) {
        return request.get(`/articleLike/article/${articleId}`, {
            params: { page, pageSize }
        })
    },
    
    getUserLikes(page = 1, pageSize = 10) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return request.get(`/articleLike/user/${userInfo.userId}`, {
            params: { page, pageSize }
        })
    }
}
