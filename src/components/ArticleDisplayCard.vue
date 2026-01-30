<template>
    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-slate-200 overflow-hidden relative inline-block w-full"
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
                    <el-icon><User /></el-icon>
                    <span>{{ article.authorName || '-' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <el-icon><Calendar /></el-icon>
                    <span>{{ formatDate(article.publishTime || article.updateTime) }}</span>
                </div>
            </div>
            <div class="flex gap-3 flex-wrap">
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <el-icon><View /></el-icon>
                    <span>{{ article.viewCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <el-icon><Star /></el-icon>
                    <span>{{ article.likeCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <el-icon><ChatDotRound /></el-icon>
                    <span>{{ article.commentCount || 0 }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { User, Calendar, View, Star, ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['view'])

const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
}

const handleViewArticle = () => {
    emit('view', props.article)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
