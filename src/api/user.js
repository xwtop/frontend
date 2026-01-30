import request from './request'

export const userAPI = {
    getList(params) {
        return request.post('/sysUser/page', params)
    },
    
    getById(id) {
        return request.get(`/sysUser/${id}/form`)
    },
    
    create(data) {
        return request.post('/sysUser/add', data)
    },
    
    update(data) {
        return request.put(`/sysUser/${data.id}/update`, data)
    },
    
    delete(ids) {
        return request.delete(`/sysUser/${ids}/delete`)
    },
    
    assignRole(userId, roleIds) {
        return request.post(`/sysUser/${userId}/assignRole`, { roleIds })
    },
    
    resetPassword(userId, password) {
        return request.put(`/sysUser/${userId}/resetPassword`, { password })
    },
    
    getRoles(userId) {
        return request.get(`/sysUser/${userId}/roles`)
    }
}
