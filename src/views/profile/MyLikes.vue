<template>
    <div class="p-2 w-full h-full flex flex-col">
        <div class="bg-white/95 rounded-xl shadow-md p-6 h-full flex flex-col">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <Heart class="w-6 h-6 text-red-500" />
                    <h2 class="text-xl font-bold text-slate-900">我的点赞</h2>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                <masonry-layout :items="articles" :column-count="getColumnCount()" v-loading="loading">
                    <template #default="{ item }">
                        <article-display-card
                            :article="item"
                            @view="handleViewArticle"
                        />
                    </template>
                </masonry-layout>
                
                <div class="flex justify-center items-center py-12" v-if="!loading && articles.length === 0">
                    <el-empty description="暂无点赞内容">
                        <el-button type="primary" @click="goToCategory">去浏览文章</el-button>
                    </el-empty>
                </div>
            </div>
        </div>
        
        <!-- 全屏详情页 -->
        <div v-if="detailVisible" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleCloseDetail"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                    <ArticleDetail
                        :article-id="currentDetailArticleId"
                        @close="handleCloseDetail"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'
import ArticleDisplayCard from '@/components/ArticleDisplayCard.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'
import MasonryLayout from '@/components/MasonryLayout.vue'
import { articleLikeAPI } from '@/api/articleLike'
import { articleAPI } from '@/api/article'

const router = useRouter()
const loading = ref(false)
const articles = ref([])
const detailVisible = ref(false)
const currentDetailArticleId = ref(null)
const windowWidth = ref(window.innerWidth)

const getColumnCount = () => {
    if (windowWidth.value >= 1536) return 4
    if (windowWidth.value >= 1024) return 3
    if (windowWidth.value >= 768) return 2
    return 1
}

const handleResize = () => {
    windowWidth.value = window.innerWidth
}

const loadLikedArticles = async () => {
    loading.value = true
    try {
        const res = await articleLikeAPI.getUserLikes(1, 100)
        const likes = res.data.list || []
        
        const articleIds = likes.map(like => like.articleId)
        
        if (articleIds.length > 0) {
            const articlePromises = articleIds.map(async (id) => {
                try {
                    const res = await articleAPI.getById(id)
                    return res.data
                } catch (error) {
                    return null
                }
            })
            
            const articleData = await Promise.all(articlePromises)
            articles.value = articleData
                .filter(a => a !== null && a !== undefined)
                .map(article => ({
                    id: article.id,
                    categoryId: article.categoryId,
                    title: article.title,
                    subTitle: article.subTitle,
                    coverImage: article.coverImage,
                    authorId: article.authorId,
                    authorName: article.authorName,
                    viewCount: article.viewCount,
                    likeCount: article.likeCount,
                    commentCount: article.commentCount,
                    isTop: article.isTop,
                    isHot: article.isHot,
                    status: article.status,
                    publishTime: article.publishTime,
                    createTime: article.createTime,
                    updateTime: article.updateTime || article.createTime
                }))
        }
    } catch (error) {
        console.error('加载点赞文章失败:', error)
    } finally {
        loading.value = false
    }
}

const handleViewArticle = (article) => {
    currentDetailArticleId.value = article.id
    detailVisible.value = true
}

const handleCloseDetail = () => {
    detailVisible.value = false
}

const goToCategory = () => {
    router.push('/content/category')
}

onMounted(() => {
    loadLikedArticles()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
