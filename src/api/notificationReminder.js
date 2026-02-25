import request from './request'

export const notificationReminderAPI = {
    // 获取定时提醒列表
    getList: () => request.get('/notificationReminder/list'),
    
    // 获取定时提醒详情
    getById: (id) => request.get(`/notificationReminder/${id}`),
    
    // 添加定时提醒
    create: (data) => request.post('/notificationReminder/add', data),
    
    // 更新定时提醒
    update: (id, data) => request.put(`/notificationReminder/${id}`, data),
    
    // 删除定时提醒
    delete: (id) => request.delete(`/notificationReminder/${id}`),
    
    // 切换定时提醒状态
    toggleStatus: (id) => request.put(`/notificationReminder/toggle-status/${id}`)
}
