<template>
    <div class="notification-list">
        <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="['notification-item', { 'unread': !notification.isRead }]"
            @click="handleClick(notification)"
        >
            <div class="notification-icon">
                <FileText v-if="notification.type === 'article_new'" class="w-5 h-5" />
                <MessageSquare v-else-if="notification.type === 'comment_reply'" class="w-5 h-5" />
                <Bell v-else class="w-5 h-5" />
            </div>
            <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-text">{{ notification.content }}</div>
                <div class="notification-time">{{ formatTime(notification.createTime) }}</div>
            </div>
            <div v-if="!notification.isRead" class="notification-dot"></div>
        </div>
        
        <div v-if="notifications.length === 0" class="empty-state">
            <Bell class="w-12 h-12 text-gray-300" />
            <p class="text-gray-500">暂无通知</p>
        </div>
    </div>
</template>

<script setup>
import { FileText, MessageSquare, Bell } from 'lucide-vue-next'

const props = defineProps({
    notifications: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['read', 'view-article'])

const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now - date
    
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    
    if (diff < minute) {
        return '刚刚'
    } else if (diff < hour) {
        return `${Math.floor(diff / minute)}分钟前`
    } else if (diff < day) {
        return `${Math.floor(diff / hour)}小时前`
    } else if (diff < 7 * day) {
        return `${Math.floor(diff / day)}天前`
    } else {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${month}-${day}`
    }
}

const handleClick = (notification) => {
    emit('read', notification)
    
    if (notification.relatedId) {
        emit('view-article', notification.relatedId)
    }
}
</script>

<style scoped>
.notification-list {
    padding: 16px;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.notification-item:hover {
    background-color: #f5f7fa;
}

.notification-item.unread {
    background-color: #f0f9ff;
}

.notification-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-title {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    font-size: 14px;
}

.notification-text {
    color: #666;
    font-size: 13px;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notification-time {
    color: #999;
    font-size: 12px;
}

.notification-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ef4444;
    flex-shrink: 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #999;
}

.empty-state p {
    margin-top: 16px;
    font-size: 14px;
}
</style>
