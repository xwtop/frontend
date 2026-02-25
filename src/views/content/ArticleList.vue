<template>
    <div class="p-2 w-full h-full flex flex-col">
        <div class="bg-white/95 rounded-xl shadow-md p-6 h-full flex flex-col">
            <div class="flex items-center justify-between gap-6 mb-6">
                <div class="flex-1 flex justify-center max-w-[200px]">
                    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="w-full">
                        <el-tab-pane label="已发布" name="published" />
                        <el-tab-pane label="已下架" name="unpublished" />
                        <el-tab-pane label="草稿箱" name="draft" />
                    </el-tabs>
                </div>
                <div class="flex justify-end items-center gap-4">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索文章标题..."
                        :prefix-icon="Search"
                        clearable
                        size="large"
                        class="w-full max-w-[300px] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        @clear="handleSearch"
                        @keyup.enter="handleSearch"
                    />
                    <el-button
                        type="primary"
                        size="large"
                        @click="handleAdd"
                        class="rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        新建文章
                    </el-button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                <masonry-layout :items="articles" :column-count="getColumnCount()" :key="activeTab">
                    <template #default="{ item }">
                        <article-card
                            :article="item"
                            @view="handleViewArticle"
                            @edit="handleEdit"
                            @refresh="loadArticles"
                        />
                    </template>
                </masonry-layout>
                
                <div class="flex justify-center items-center py-12" v-if="!articles.length && !loading">
                    <el-empty description="暂无文章" />
                </div>
                
                <div class="flex justify-center items-center py-8" v-if="loading && articles.length > 0">
                    <el-icon class="is-loading" :size="32">
                        <Loading />
                    </el-icon>
                </div>
            </div>
        </div>
        
        <!-- 全屏编辑器 -->
        <div v-if="editorVisible" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleCloseEditor"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                    <ArticleEditor
                        v-model="editorVisible"
                        :article-id="currentArticleId"
                        @success="loadArticles"
                    />
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
import { ElMessage } from 'element-plus'
import { Search, Loading } from '@element-plus/icons-vue'
import ArticleEditor from '@/components/ArticleEditor.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'
import MasonryLayout from '@/components/MasonryLayout.vue'
import { articleAPI } from '@/api/article'

const activeTab = ref('published')
const loading = ref(false)
const searchKeyword = ref('')
const editorVisible = ref(false)
const currentArticleId = ref(null)
const detailVisible = ref(false)
const currentDetailArticleId = ref(null)
const windowWidth = ref(window.innerWidth)

const articles = ref([])

const getStatusValue = () => {
    switch (activeTab.value) {
        case 'published':
            return 1
        case 'unpublished':
            return 2
        case 'draft':
            return 0
        default:
            return 1
    }
}

const handleTabChange = () => {
    loadArticles()
}

const handleSearch = () => {
    loadArticles()
}

const loadArticles = async () => {
    if (loading.value) return
    loading.value = true
    
    // 先清空文章列表，避免显示旧数据
    articles.value = []
    
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const res = await articleAPI.getList({
            author_id: userInfo.userId,
            status: getStatusValue(),
            title: searchKeyword.value,
            page: 1,
            page_size: 100
        })
        
        const articleList = res.data.list || []
        const newArticles = articleList.map(article => ({
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
        
        articles.value = newArticles
    } catch (error) {
        console.error('加载文章失败:', error)
        ElMessage.error('加载失败')
        articles.value = []
    } finally {
        loading.value = false
    }
}

const getColumnCount = () => {
    if (windowWidth.value >= 1536) return 4
    if (windowWidth.value >= 1024) return 3
    if (windowWidth.value >= 768) return 2
    return 1
}

const handleResize = () => {
    windowWidth.value = window.innerWidth
}

const handleAdd = () => {
    currentArticleId.value = null
    editorVisible.value = true
}

const handleEdit = (article) => {
    currentArticleId.value = article.id
    editorVisible.value = true
}

const handleViewArticle = (article) => {
    currentDetailArticleId.value = article.id
    detailVisible.value = true
}

const handleCloseEditor = () => {
    editorVisible.value = false
}

const handleCloseDetail = () => {
    detailVisible.value = false
}

onMounted(() => {
    loadArticles()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* 加载动画 */
.is-loading {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 标签页样式美化 */
:deep(.el-tabs__header) {
    background: transparent;
    border-radius: 0;
    padding: 0;
    margin: 0;
    box-shadow: none;
    border: none;
}

:deep(.el-tabs__nav-wrap::after) {
    display: none;
}

:deep(.el-tabs__nav-scroll) {
    overflow: visible;
    display: flex;
    justify-content: center;
}

:deep(.el-tabs__nav) {
    border: none;
    display: flex;
    justify-content: center;
    width: 100%;
}

:deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 500;
    padding: 0;
    margin: 0 16px;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    transition: all 0.2s ease;
    color: #000000;
    border: none;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.el-tabs__item:hover) {
    color: #2633f0;
}

:deep(.el-tabs__item.is-active) {
    color: #3a4df7;
    font-weight: 600;
}

:deep(.el-tabs__item.is-active::after) {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: #3a4df7;
    border-radius: 2px;
}

:deep(.el-tabs__active-bar) {
    display: none;
}
</style>