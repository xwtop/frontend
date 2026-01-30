import request from './request'

export const categoryAPI = {
    getTree() {
        return request.get('/category/tree')
    },
    
    getList(params) {
        return request.post('/category/page', params)
    },
    
    getById(id) {
        return request.get(`/category/${id}/form`)
    },
    
    create(data) {
        return request.post('/category/add', data)
    },
    
    update(data) {
        return request.put(`/category/${data.id}/update`, data)
    },
    
    delete(ids) {
        return request.delete(`/category/${ids}/delete`)
    }
}
