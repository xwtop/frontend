import request from './request'

export const roleAPI = {
    getList(params) {
        return request.post('/sysRole/page', params)
    },
    
    listAll() {
        return request.get('/sysRole/list')
    },
    
    getById(id) {
        return request.get(`/sysRole/${id}/form`)
    },
    
    create(data) {
        return request.post('/sysRole/add', data)
    },
    
    update(data) {
        return request.put(`/sysRole/${data.id}/update`, data)
    },
    
    delete(ids) {
        return request.delete(`/sysRole/${ids}/delete`)
    }
}
