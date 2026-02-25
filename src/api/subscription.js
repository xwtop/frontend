import request from './request'

export const subscriptionAPI = {
    subscribe: (data) => request.post('/subscription/subscribe', data),
    unsubscribe: (data) => request.post('/subscription/unsubscribe', data),
    list: () => request.get('/subscription/list'),
    isSubscribed: (categoryId) => request.get(`/subscription/is-subscribed/${categoryId}`),
    batchSubscribed: (categoryIds) => request.post('/subscription/batch-subscribed', { category_ids: categoryIds })
}
