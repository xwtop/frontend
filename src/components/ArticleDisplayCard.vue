<template>
    <div v-if="article" class="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-slate-200 overflow-hidden relative w-full"
         @click="handleViewArticle">
        <div class="absolute top-3 left-3 z-10">
            <el-tag v-if="article.isTop === 1" type="warning" size="small" effect="dark">
                置顶
            </el-tag>
            <el-tag v-if="article.isHot === 1" type="danger" size="small" effect="dark" class="ml-2">
                热门
            </el-tag>
        </div>
        <div class="relative" v-if="article.coverImage">
            <img :src="article.coverImage" :alt="article.title" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
        </div>
        <div class="p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {{ article.title }}
            </h3>
            <p v-if="article.subTitle" class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ article.subTitle }}
            </p>
            <div class="flex flex-wrap gap-4 mb-4 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <User class="w-4 h-4" />
                    <span>{{ article.authorName || '-' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDate(article.publishTime || article.updateTime) }}</span>
                </div>
            </div>
            <div class="flex flex-wrap justify-between items-center">
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <Eye class="w-4 h-4" />
                    <span>{{ article.viewCount || 0 }}</span>
                </div>
                <div 
                    class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    :class="{ 'text-red-500 bg-red-50': isLiked }"
                    @click.stop="handleLike"
                >
                    <Heart :fill="isLiked ? 'currentColor' : 'none'" class="w-4 h-4" />
                    <span>{{ likeCount }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <MessageSquare class="w-4 h-4" />
                    <span>{{ article.commentCount || 0 }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Heart, User, Calendar, Eye, MessageSquare } from 'lucide-vue-next'
import { articleLikeAPI } from '@/api/articleLike'

const props = defineProps({
    article: {
        type: Object,
        required: true
    },
    initialLiked: {
        type: Boolean,
        default: undefined
    }
})

const emit = defineEmits(['view'])

const isLiked = ref(false)
const likeCount = ref(props.article?.likeCount || 0)
const checkedArticleId = ref(null)

const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
}

const checkLikeStatus = async () => {
    if (!props.article?.id) return
    if (checkedArticleId.value === props.article.id) return
    
    checkedArticleId.value = props.article.id
    
    if (props.initialLiked !== undefined) {
        isLiked.value = props.initialLiked
        return
    }
    
    try {
        const res = await articleLikeAPI.check(props.article.id)
        isLiked.value = res.data || false
    } catch (error) {
        console.error('检查点赞状态失败:', error)
    }
}

const handleLike = async () => {
    if (!props.article?.id) return
    try {
        const res = await articleLikeAPI.toggle(props.article.id)
        isLiked.value = res.data
        
        if (isLiked.value) {
            likeCount.value++
            ElMessage.success('点赞成功')
        } else {
            likeCount.value--
            ElMessage.success('取消点赞')
        }
    } catch (error) {
        ElMessage.error('操作失败')
        console.error('点赞操作失败:', error)
    }
}

const handleViewArticle = () => {
    if (!props.article) return
    emit('view', props.article)
}

watch(() => props.article?.id, (newId) => {
    if (newId && newId !== checkedArticleId.value) {
        checkLikeStatus()
    }
}, { immediate: true })

watch(() => props.initialLiked, (newVal) => {
    if (newVal !== undefined) {
        isLiked.value = newVal
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
