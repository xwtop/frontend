<template>
    <div class="notification-message-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>消息通知</span>
                    <el-button v-if="unreadMessages.length > 0" type="primary" size="small" @click="handleMarkAllRead">
                        全部已读
                    </el-button>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="全部消息" name="all">
                    <MessageList :data="allMessages" @mark-read="handleMarkRead" @delete="handleDelete" @click="handleMessageClick" />
                </el-tab-pane>
                <el-tab-pane label="未读消息" name="unread">
                    <MessageList :data="unreadMessages" @mark-read="handleMarkRead" @delete="handleDelete" @click="handleMessageClick" />
                </el-tab-pane>
                <el-tab-pane label="已读消息" name="read">
                    <MessageList :data="readMessages" @mark-read="handleMarkRead" @delete="handleDelete" @click="handleMessageClick" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
        
        <div v-if="showArticleDetail" class="fixed inset-0 z-[2000]">
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleCloseArticleDetail"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                    <ArticleDetail
                        :article-id="selectedArticleId"
                        @close="handleCloseArticleDetail"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import MessageList from './components/MessageList.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'
import { notificationAPI } from '@/api/notification'

const activeTab = ref('all')
const showArticleDetail = ref(false)
const selectedArticleId = ref('')

const allMessages = ref([])
const unreadMessages = ref([])
const readMessages = ref([])

const loadMessages = async () => {
    try {
        const result = await notificationAPI.list({})
        allMessages.value = (result.data || []).map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            type: item.type,
            status: item.isRead ? 'read' : 'unread',
            createTime: item.createTime,
            relatedId: item.relatedId
        }))
        unreadMessages.value = allMessages.value.filter(msg => msg.status === 'unread')
        readMessages.value = allMessages.value.filter(msg => msg.status === 'read')
    } catch (error) {
        ElMessage.error('加载消息失败')
    }
}

const handleMarkRead = async (id) => {
    try {
        await notificationAPI.markRead(id)
        const message = allMessages.value.find(msg => msg.id === id)
        if (message) {
            message.status = 'read'
            unreadMessages.value = allMessages.value.filter(msg => msg.status === 'unread')
            readMessages.value = allMessages.value.filter(msg => msg.status === 'read')
        }
        ElMessage.success('已标记为已读')
    } catch (error) {
        ElMessage.error('标记已读失败')
    }
}

const handleMarkAllRead = async () => {
    try {
        await notificationAPI.markAllRead()
        allMessages.value.forEach(msg => msg.status = 'read')
        unreadMessages.value = []
        readMessages.value = [...allMessages.value]
        ElMessage.success('已全部标记为已读')
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

const handleDelete = (id) => {
    const index = allMessages.value.findIndex(msg => msg.id === id)
    if (index > -1) {
        allMessages.value.splice(index, 1)
        unreadMessages.value = allMessages.value.filter(msg => msg.status === 'unread')
        readMessages.value = allMessages.value.filter(msg => msg.status === 'read')
    }
    ElMessage.success('消息已删除')
}

const handleMessageClick = (message) => {
    if (message.status === 'unread') {
        handleMarkRead(message.id)
    }
    
    if (message.relatedId) {
        selectedArticleId.value = message.relatedId
        showArticleDetail.value = true
    }
}

const handleCloseArticleDetail = () => {
    showArticleDetail.value = false
    selectedArticleId.value = ''
}

onMounted(() => {
    loadMessages()
})
</script>

<style scoped>
.notification-message-container {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
}
</style>
