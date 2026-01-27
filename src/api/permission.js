import request from '../utils/request'

export const permissionAPI = {
    getList(params) {
        return request.post('/sysPermission/page', params)
    },

    listAll() {
        return request.get('/sysPermission/list')
    },
    
    getById(id) {
        return request.get(`/sysPermission/${id}/form`)
    },
    
    create(data) {
        return request.post('/sysPermission/add', data)
    },
    
    update(data) {
        return request.put(`/sysPermission/${data.id}/update`, data)
    },
    
    delete(ids) {
        return request.delete(`/sysPermission/${ids}/delete`)
    }
}
