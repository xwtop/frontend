<template>
    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-purple-100 overflow-hidden relative inline-block w-full"
         @click="handleViewArticle">
        <!-- 左上角置顶标签 -->
        <div class="absolute top-3 left-3 z-10" @click.stop>
            <el-tag v-if="article.isTop === 1" type="warning" size="small" effect="dark">
                置顶
            </el-tag>
        </div>
        <!-- 右上角菜单按钮 -->
        <div class="absolute top-3 right-3 z-10" @click.stop>
            <el-dropdown @command="handleMenuCommand" trigger="click">
                <el-button circle size="small" class="bg-white/80 backdrop-blur-sm hover:bg-white">
                    <MoreVertical class="w-4 h-4" />
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="edit">
                            <Edit class="w-4 h-4 mr-2" />
                            编辑
                        </el-dropdown-item>
                        <el-dropdown-item command="top" v-if="article.isTop !== 1">
                            <ArrowUp class="w-4 h-4 mr-2" />
                            置顶
                        </el-dropdown-item>
                        <el-dropdown-item command="untop" v-else>
                            <ArrowDown class="w-4 h-4 mr-2" />
                            取消置顶
                        </el-dropdown-item>
                        <el-dropdown-item command="unpublish" v-if="article.status === 1">
                            <Download class="w-4 h-4 mr-2" />
                            下架
                        </el-dropdown-item>
                        <el-dropdown-item command="publish" v-if="article.status === 0 || article.status === 2">
                            <Send class="w-4 h-4 mr-2" />
                            发布
                        </el-dropdown-item>
                        <el-dropdown-item command="delete" divided>
                            <Trash2 class="w-4 h-4 mr-2" />
                            删除
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="relative" v-if="article.coverImage">
            <img :src="article.coverImage" :alt="article.title" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
        </div>
        <div class="p-6">
            <h3 class="text-lg font-semibold text-purple-900 mb-3 line-clamp-2">
                {{ article.title }}
            </h3>
            <p v-if="article.subTitle" class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ article.subTitle }}
            </p>
            <div class="flex flex-wrap gap-4 mb-4 pb-4 border-b border-purple-100">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <User class="w-4 h-4" />
                    <span>{{ article.authorName || '-' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDate(article.publishTime || article.updateTime) }}</span>
                </div>
            </div>
            <div class="flex gap-3 flex-wrap justify-between items-center">
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-purple-50 rounded-md hover:bg-purple-100 hover:text-purple-700 transition-colors">
                    <Eye class="w-4 h-4" />
                    <span>{{ article.viewCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-purple-50 rounded-md hover:bg-purple-100 hover:text-purple-700 transition-colors">
                    <Heart class="w-4 h-4" />
                    <span>{{ article.likeCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-purple-50 rounded-md hover:bg-purple-100 hover:text-purple-700 transition-colors">
                    <MessageSquare class="w-4 h-4" />
                    <span>{{ article.commentCount || 0 }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    Edit, 
    MoreVertical, 
    ArrowUp, 
    ArrowDown, 
    Download, 
    Trash2, 
    User, 
    Calendar, 
    Eye, 
    Heart, 
    MessageSquare, 
    Send 
} from 'lucide-vue-next'
import { articleAPI } from '@/api/article'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

const emit = defineEmits([
    'view',
    'edit',
    'refresh'
])

const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const handleViewArticle = () => {
    emit('view', props.article)
}

const handleMenuCommand = async (command) => {
    switch (command) {
        case 'edit':
            emit('edit', props.article)
            break
        case 'top':
            await handleToggleTop(1)
            break
        case 'untop':
            await handleToggleTop(0)
            break
        case 'unpublish':
            await handleUnpublish()
            break
        case 'publish':
            await handlePublish()
            break
        case 'delete':
            await handleDelete()
            break
    }
}

const handleToggleTop = async (isTop) => {
    try {
        await articleAPI.setTop(props.article.id, isTop)
        ElMessage.success(isTop ? '置顶成功' : '取消置顶成功')
        emit('refresh')
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

const handleUnpublish = async () => {
    try {
        await ElMessageBox.confirm('确定要下架这篇文章吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await articleAPI.unpublish(props.article.id)
        ElMessage.success('下架成功')
        emit('refresh')
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('下架失败')
        }
    }
}

const handlePublish = async () => {
    try {
        await ElMessageBox.confirm('确定要发布这篇文章吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
        })
        await articleAPI.publish(props.article.id)
        ElMessage.success('发布成功')
        emit('refresh')
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('发布失败')
        }
    }
}

const handleDelete = async () => {
    try {
        await ElMessageBox.confirm('确定要删除这篇文章吗？删除后无法恢复。', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await articleAPI.delete(props.article.id)
        ElMessage.success('删除成功')
        emit('refresh')
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}
</script>

<style scoped>
/* 组件样式已在模板中定义 */
</style>