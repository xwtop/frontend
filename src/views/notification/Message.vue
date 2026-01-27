<template>
    <div class="notification-message-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>消息通知</span>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="全部消息" name="all">
                    <MessageList :data="allMessages" @mark-read="handleMarkRead" @delete="handleDelete" />
                </el-tab-pane>
                <el-tab-pane label="未读消息" name="unread">
                    <MessageList :data="unreadMessages" @mark-read="handleMarkRead" @delete="handleDelete" />
                </el-tab-pane>
                <el-tab-pane label="已读消息" name="read">
                    <MessageList :data="readMessages" @mark-read="handleMarkRead" @delete="handleDelete" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import MessageList from './components/MessageList.vue'

const activeTab = ref('all')

const allMessages = ref([
    { id: 1, title: '系统维护通知', content: '系统将于2026年1月30日凌晨2点进行维护，预计持续2小时。', type: 'system', status: 'unread', createTime: '2026-01-27 10:00:00' },
    { id: 2, title: '您的评论有新回复', content: '您在"校园智慧平台使用指南"下的评论收到了新回复。', type: 'comment', status: 'unread', createTime: '2026-01-26 15:30:00' },
    { id: 3, title: '活动提醒', content: '您报名的"校园开放日"活动将于明天上午9点开始。', type: 'activity', status: 'read', createTime: '2026-01-25 09:00:00' },
    { id: 4, title: '公告更新', content: '2026年春季学期选课通知已更新，请及时查看。', type: 'announcement', status: 'read', createTime: '2026-01-24 14:20:00' }
])

const unreadMessages = ref(allMessages.value.filter(msg => msg.status === 'unread'))
const readMessages = ref(allMessages.value.filter(msg => msg.status === 'read'))

const handleMarkRead = (id) => {
    ElMessage.success('已标记为已读')
}

const handleDelete = (id) => {
    ElMessage.success('消息已删除')
}
</script>

<style scoped>
.notification-message-container {
    padding: 20px;
}
</style>
