import request from './request'

export const notificationAPI = {
    list: (params) => request.get('/notification/list', { params }),
    unreadCount: () => request.get('/notification/unread-count'),
    markRead: (notificationId) => request.post(`/notification/mark-read/${notificationId}`),
    markAllRead: () => request.post('/notification/mark-all-read')
}
