<template>
    <div class="message-list">
        <div v-for="item in data" :key="item.id" class="message-item" :class="{ 'unread': item.status === 'unread' }" @click="handleClick(item)">
            <div class="message-header">
                <div class="message-title">
                    <span class="message-type">{{ getTypeIcon(item.type) }}</span>
                    <span>{{ item.title }}</span>
                </div>
                <div class="message-actions" @click.stop>
                    <el-button v-if="item.status === 'unread'" type="primary" size="small" link @click="$emit('mark-read', item.id)">
                        标记已读
                    </el-button>
                    <el-button type="danger" size="small" link @click="$emit('delete', item.id)">删除</el-button>
                </div>
            </div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
                <span class="message-time">{{ formatTime(item.createTime) }}</span>
                <el-tag v-if="item.status === 'unread'" type="danger" size="small">未读</el-tag>
            </div>
        </div>
        <el-empty v-if="data.length === 0" description="暂无消息" />
    </div>
</template>

<script setup>
defineProps({
    data: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['mark-read', 'delete', 'click'])

const getTypeIcon = (type) => {
    const icons = {
        system: '🔔',
        comment: '💬',
        activity: '🎉',
        announcement: '📢'
    }
    return icons[type] || '📄'
}

const formatTime = (time) => {
    if (!time) return ''
    return time.replace('T', ' ')
}

const handleClick = (item) => {
    emit('click', item)
}
</script>

<style scoped>
.message-list {
    padding: 10px 0;
}

.message-item {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    transition: all 0.3s;
}

.message-item:hover {
    background-color: #f5f7fa;
}

.message-item.unread {
    background-color: #f0f9ff;
}

.message-item.unread .message-title {
    font-weight: bold;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.message-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: #303133;
}

.message-type {
    font-size: 20px;
}

.message-content {
    color: #606266;
    margin-bottom: 10px;
    line-height: 1.6;
}

.message-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message-time {
    color: #909399;
    font-size: 14px;
}
</style>
