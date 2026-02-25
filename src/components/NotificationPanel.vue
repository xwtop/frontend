<template>
    <el-drawer
        v-model="drawerVisible"
        title="通知中心"
        size="400px"
        :with-header="true"
    >
        <template #header>
            <div class="flex items-center justify-between">
                <span class="text-lg font-semibold">通知中心</span>
                <el-button
                    v-if="unreadCount > 0"
                    link
                    type="primary"
                    @click="handleMarkAllRead"
                >
                    全部已读
                </el-button>
            </div>
        </template>

        <div class="h-full flex flex-col">
            <el-tabs v-model="activeTab" class="flex-1 flex flex-col">
                <el-tab-pane label="全部" name="all">
                    <div class="h-full overflow-y-auto">
                        <NotificationList
                            :notifications="allNotifications"
                            @read="handleRead"
                            @view-article="handleViewArticle"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="未读" name="unread">
                    <div class="h-full overflow-y-auto">
                        <NotificationList
                            :notifications="unreadNotifications"
                            @read="handleRead"
                            @view-article="handleViewArticle"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-drawer>
    
    <!-- 全屏详情页 -->
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { notificationAPI } from '@/api/notification'
import NotificationList from './NotificationList.vue'
import ArticleDetail from './ArticleDetail.vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:visible', 'refresh'])

const drawerVisible = ref(props.visible)
const activeTab = ref('all')
const allNotifications = ref([])
const unreadNotifications = ref([])
const showArticleDetail = ref(false)
const selectedArticleId = ref('')

const unreadCount = computed(() => unreadNotifications.value.length)

watch(() => props.visible, (newVal) => {
    drawerVisible.value = newVal
    if (newVal) {
        loadNotifications()
    }
})

watch(drawerVisible, (newVal) => {
    emit('update:visible', newVal)
})

const loadNotifications = async () => {
    try {
        const [allResult, unreadResult] = await Promise.all([
            notificationAPI.list({}),
            notificationAPI.list({ unreadOnly: true })
        ])
        allNotifications.value = allResult.data || []
        unreadNotifications.value = unreadResult.data || []
    } catch (error) {
        ElMessage.error('加载通知失败')
    }
}

const handleRead = async (notification) => {
    if (!notification.isRead) {
        try {
            await notificationAPI.markRead(notification.id)
            notification.isRead = 1
            emit('refresh')
        } catch (error) {
            ElMessage.error('标记已读失败')
        }
    }
}

const handleMarkAllRead = async () => {
    try {
        await notificationAPI.markAllRead()
        unreadNotifications.value = []
        allNotifications.value.forEach(n => n.isRead = 1)
        emit('refresh')
        ElMessage.success('已全部标记为已读')
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

const handleViewArticle = (articleId) => {
    selectedArticleId.value = articleId
    showArticleDetail.value = true
}

const handleCloseArticleDetail = () => {
    showArticleDetail.value = false
    selectedArticleId.value = ''
}
</script>

<style scoped>
:deep(.el-drawer__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
}

:deep(.el-tabs) {
    display: flex;
    flex-direction: column;
    height: 100%;
}

:deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
}

:deep(.el-tab-pane) {
    height: 100%;
}
</style>
