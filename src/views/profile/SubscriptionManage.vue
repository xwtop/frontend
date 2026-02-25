<template>
    <div class="h-full w-full flex flex-col bg-white">
        <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold">我的订阅</h2>
    </div>

        <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading" class="flex justify-center py-8">
                <Loader2 class="w-6 h-6 animate-spin text-gray-400" />
            </div>

            <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-500">
                <Bell class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无订阅，去订阅感兴趣的分类吧~</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="subscription-card"
                >
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                                {{ category.name?.charAt(0) }}
                            </div>
                            <div>
                                <div class="font-medium text-gray-900">{{ category.name }}</div>
                                <div class="text-sm text-gray-500">
                                    订阅于 {{ formatDate(category.subscribeTime) }}
                                </div>
                            </div>
                        </div>
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleUnsubscribe(category.id)"
                        >
                            取消订阅
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, Loader2 } from 'lucide-vue-next'
import { subscriptionAPI } from '@/api/subscription'
import { categoryAPI } from '@/api/category'

const loading = ref(false)
const subscriptions = ref([])
const categories = ref([])

const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const loadSubscriptions = async () => {
    loading.value = true
    try {
        const result = await subscriptionAPI.list()
        subscriptions.value = result.data || []
        
        await loadCategoryDetails()
    } catch (error) {
        ElMessage.error('加载订阅失败')
    } finally {
        loading.value = false
    }
}

const loadCategoryDetails = async () => {
    const categoryIds = subscriptions.value.map(s => s.categoryId)
    
    const categoryPromises = categoryIds.map(async (categoryId) => {
        try {
            const result = await categoryAPI.getById(categoryId)
            return result.data
        } catch (error) {
            return null
        }
    })
    
    const categoryData = await Promise.all(categoryPromises)
    categories.value = categoryData.filter(c => c !== null).map(category => {
        const subscription = subscriptions.value.find(s => s.categoryId === category.id)
        return {
            ...category,
            subscribeTime: subscription?.subscribeTime
        }
    })
}

const handleUnsubscribe = async (categoryId) => {
    try {
        await ElMessageBox.confirm('确定要取消订阅吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        await subscriptionAPI.unsubscribe({
            user_id: userInfo.userId,
            category_id: categoryId
        })
        
        ElMessage.success('取消订阅成功')
        loadSubscriptions()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('取消订阅失败')
        }
    }
}



onMounted(() => {
    loadSubscriptions()
})
</script>

<style scoped>
.subscription-card {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s;
}

.subscription-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
