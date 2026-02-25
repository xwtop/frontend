<template>
    <div class="p-5 md:p-5 lg:p-6">
        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>个性推荐</span>
                    <el-tag size="small" type="success" class="animate-pulse">智能</el-tag>
                </h2>
                <el-button type="primary" @click="refreshRecommendations">
                    <el-icon><Refresh /></el-icon>
                    刷新推荐
                </el-button>
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-6">
                <div class="flex items-start gap-3">
                    <el-icon class="text-blue-500 mt-0.5"><InfoFilled /></el-icon>
                    <p class="text-blue-700 text-sm leading-relaxed">
                        基于您的点赞、评论、订阅和浏览行为，我们为您智能推荐感兴趣的内容，让您的校园生活更加丰富多彩。
                    </p>
                </div>
            </div>
        </div>

        <div v-if="loading" class="mt-5">
            <el-skeleton :rows="10" animated />
        </div>

        <div v-else-if="recommendations.length === 0" class="mt-10 min-h-[400px] flex items-center justify-center">
            <el-empty description="暂无推荐内容" />
        </div>

        <div v-else class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleDisplayCard
                v-for="article in formattedRecommendations"
                :key="article.id"
                :article="article"
                @view="handleViewArticle"
            />
        </div>

        <!-- 全屏文章详情 -->
        <transition name="detail-fade">
            <div v-if="showArticleDetail" class="fixed inset-0 z-[2000]">
                <div class="absolute inset-0 bg-black/50" @click="handleCloseArticleDetail"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4">
                    <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                        <ArticleDetail
                            v-if="selectedArticleId"
                            :article-id="selectedArticleId"
                            @close="handleCloseArticleDetail"
                        />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, InfoFilled } from '@element-plus/icons-vue'
import { recommendationAPI } from '../../api/recommendation'
import ArticleDisplayCard from '../../components/ArticleDisplayCard.vue'
import ArticleDetail from '../../components/ArticleDetail.vue'

const loading = ref(true)
const recommendations = ref([])
const showArticleDetail = ref(false)
const selectedArticleId = ref('')

// 格式化推荐数据，适配ArticleDisplayCard组件的数据结构
const formattedRecommendations = computed(() => {
    return recommendations.value.map(article => {
        return {
            id: article.id,
            title: article.title,
            subTitle: article.sub_title,
            coverImage: article.cover_image,
            authorName: article.author_name,
            publishTime: article.publish_time,
            viewCount: article.view_count,
            likeCount: article.like_count,
            commentCount: article.comment_count,
            isTop: 0, // 默认为非置顶
            isHot: 0 // 默认为非热门
        }
    })
})

const getRecommendations = async () => {
    loading.value = true
    try {
        const response = await recommendationAPI.getPersonalizedRecommendations()
        if (response.status === 200) {
            recommendations.value = response.data
        } else {
            ElMessage.error('获取推荐内容失败')
        }
    } catch (error) {
        ElMessage.error('网络错误，请稍后重试')
    } finally {
        loading.value = false
    }
}

const refreshRecommendations = () => {
    getRecommendations()
}

const handleViewArticle = (article) => {
    selectedArticleId.value = article.id
    showArticleDetail.value = true
}

const handleCloseArticleDetail = () => {
    showArticleDetail.value = false
    selectedArticleId.value = ''
}

onMounted(() => {
    getRecommendations()
})
</script>

<style scoped>
/* 文章详情过渡动画 */
.detail-fade-enter-active,
.detail-fade-leave-active {
    transition: opacity 0.3s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
    opacity: 0;
}
</style>