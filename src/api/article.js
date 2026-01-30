import request from './request'

export const articleAPI = {
    getList(params) {
        return request.post('/article/page', params)
    },
    
    getById(id) {
        return request.get(`/article/${id}/form`)
    },
    
    create(data) {
        return request.post('/article/add', data)
    },
    
    update(data) {
        return request.put(`/article/${data.id}/update`, data)
    },
    
    delete(ids) {
        return request.delete(`/article/${ids}/delete`)
    },
    
    publish(id) {
        return request.post(`/article/${id}/publish`)
    },
    
    unpublish(id) {
        return request.post(`/article/${id}/unpublish`)
    },
    
    setTop(id, isTop = 1) {
        return request.post(`/article/${id}/top`, { isTop })
    },
    
    setHot(id, isHot = 1) {
        return request.post(`/article/${id}/hot`, { isHot })
    },
    
    incrementView(id) {
        return request.post(`/article/${id}/view`)
    },
    
    getHotArticles(limit = 10) {
        return request.get('/article/hot', { params: { limit } })
    },
    
    getTopArticles(limit = 10) {
        return request.get('/article/top', { params: { limit } })
    }
}
