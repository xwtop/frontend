import request from './request'

export const articleCommentAPI = {
    getList(params) {
        return request.post('/articleComment/page', params)
    },
    
    getById(id) {
        return request.get(`/articleComment/${id}/form`)
    },
    
    create(data) {
        return request.post('/articleComment/add', data)
    },
    
    delete(id) {
        return request.delete(`/articleComment/${id}/delete`)
    },
    
    getCommentTree(articleId) {
        return request.get(`/articleComment/article/${articleId}/tree`)
    },
    
    getUserComments(userId, page = 1, pageSize = 10) {
        return request.get(`/articleComment/user/${userId}`, {
            params: { page, pageSize }
        })
    }
}
