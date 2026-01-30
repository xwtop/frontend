import request from './request'

export const commentAPI = {
    getTree(articleId) {
        return request.get(`/articleComment/article/${articleId}/tree`)
    },
    
    create(data) {
        return request.post('/articleComment/add', data)
    },
    
    delete(commentId) {
        return request.delete(`/articleComment/${commentId}/delete`)
    }
}
