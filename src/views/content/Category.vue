<template>
    <div class="bg-gradient-to-br from-slate-50 to-slate-100 w-full h-full flex">
        <div class="flex-1 flex lg:flex-row gap-2">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full lg:w-52 shrink-1">
                <h2 class="text-lg font-bold text-slate-900 mb-4">全部分类</h2>
                <el-input
                    v-model="filterText"
                    placeholder="输入关键字过滤"
                    clearable
                    class="mb-4"
                >
                    <template #prefix>
                        <Search class="w-4 h-4 text-slate-400" />
                    </template>
                </el-input>
                <div class="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                    <el-tree
                        ref="categoryTreeRef"
                        :data="categories"
                        :props="treeProps"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        :accordion="true"
                        :filter-node-method="filterNode"
                        node-key="id"
                    >
                    <template #default="{ node, data }">
                        <div class="custom-tree-node" @click="handleNodeClick(data, node)">
                            <span class="node-label">{{ node.label }}</span>
                            <div
                                v-if="!data.children || data.children.length === 0"
                                class="star-icon"
                                :class="{ 'star-active': data.isSubscribed }"
                                @click.stop="handleSubscribe(data)"
                            >
                                <Star :fill="data.isSubscribed ? 'currentColor' : 'none'" class="w-4 h-4" />
                            </div>
                        </div>
                    </template>
                    </el-tree>
                </div>
            </div>

            <div class="flex-1 min-w-0">
                <div v-if="selectedCategory" class="bg-white/95 rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                    <div v-loading="loading" class="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                        <masonry-layout :items="articles" :column-count="getColumnCount()" :key="`category-${selectedCategory?.id || 'all'}`">
                            <template #default="{ item }">
                                <article-display-card
                                    :article="item"
                                    @view="handleViewArticle"
                                />
                            </template>
                        </masonry-layout>
                        
                        <div class="flex justify-center items-center py-12" v-if="!loading && articles.length === 0">
                            <el-empty description="暂无内容" />
                        </div>
                    </div>
                </div>

                <div v-else class="bg-white/95 rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                    <div v-loading="loading" class="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                        <masonry-layout :items="articles" :column-count="getColumnCount()" :key="'hot'">
                            <template #default="{ item }">
                                <article-display-card
                                    :article="item"
                                    @view="handleViewArticle"
                                />
                            </template>
                        </masonry-layout>
                        
                        <div class="flex justify-center items-center py-12" v-if="!loading && articles.length === 0">
                            <el-empty description="暂无热门文章" />
                        </div>
                    </div>
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
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { categoryAPI } from '@/api/category'
import { articleAPI } from '@/api/article'
import { subscriptionAPI } from '@/api/subscription'
import {
    Search,
    Star
} from 'lucide-vue-next'
import ArticleDisplayCard from '@/components/ArticleDisplayCard.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'
import MasonryLayout from '@/components/MasonryLayout.vue'

const router = useRouter()

const categoryTreeRef = ref(null)
const categories = ref([])
const selectedCategory = ref(null)
const articles = ref([])
const loading = ref(false)
const filterText = ref('')
const detailVisible = ref(false)
const currentDetailArticleId = ref(null)
const masonryRef = ref(null)
const windowWidth = ref(window.innerWidth)

const treeProps = {
    children: 'children',
    label: 'name'
}

watch(filterText, (val) => {
    categoryTreeRef.value?.filter(val)
})

const filterNode = (value, data) => {
    if (!value) return true
    return data.name.includes(value)
}

const loadCategories = async () => {
    try {
        loading.value = true
        const res = await categoryAPI.getTree()
        if (res.status === 200 && res.data) {
            categories.value = await processCategories(res.data)
        }
    } catch (error) {
        console.error('加载分类失败:', error)
    } finally {
        loading.value = false
    }
}

const processCategories = async (tree) => {
    const leafCategories = []
    
    const collectLeafNodes = (node) => {
        if (!node.children || node.children.length === 0) {
            leafCategories.push(node.id)
        } else {
            node.children.forEach(collectLeafNodes)
        }
    }
    
    tree.forEach(collectLeafNodes)
    
    let subscribedMap = {}
    if (leafCategories.length > 0) {
        try {
            const result = await subscriptionAPI.batchSubscribed(leafCategories)
            subscribedMap = result.data || {}
        } catch (error) {
            console.error('批量查询订阅状态失败:', error)
        }
    }
    
    const processNode = (node) => {
        const processed = {
            ...node,
            children: node.children ? node.children.map(processNode) : [],
            isSubscribed: subscribedMap[node.id] || false
        }
        return processed
    }
    
    return tree.map(processNode)
}

const handleNodeClick = (data, node) => {
    if (!data.children || data.children.length === 0) {
        selectedCategory.value = data
        articles.value = []
        loadArticles()
    } else {
        if (node.expanded) {
            node.collapse()
        } else {
            node.expand()
        }
    }
}

const loadArticles = async () => {
    try {
        loading.value = true
        articles.value = []
        const params = {
            status: 1
        }

        if (selectedCategory.value) {
            params.category_id = selectedCategory.value.id
        } else {
            params.min_view_count = 50
        }

        const res = await articleAPI.getList(params)
        if (res.status === 200 && res.data) {
            const articleList = res.data.list || []
            articles.value = articleList.map(article => ({
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
        console.error('加载文章失败:', error)
        articles.value = []
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

const handleSubscribe = async (category) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    
    try {
        if (category.isSubscribed) {
            await subscriptionAPI.unsubscribe({
                user_id: userInfo.userId,
                category_id: category.id
            })
            category.isSubscribed = false
            ElMessage.success('取消订阅成功')
        } else {
            await subscriptionAPI.subscribe({
                user_id: userInfo.userId,
                category_id: category.id
            })
            category.isSubscribed = true
            ElMessage.success('订阅成功')
        }
    } catch (error) {
        ElMessage.error(category.isSubscribed ? '取消订阅失败' : '订阅失败')
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

onMounted(() => {
    loadCategories()
    loadArticles()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}
</script>

<style scoped>
.el-tree :deep(.el-tree-node__label) {
    font-size: 15px;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    cursor: pointer;
    width: 100%;
}

.node-label {
    font-size: 15px;
    color: #334155;
}

.el-tree :deep(.el-tree-node__content:hover) {
    background-color: #f1f5f9;
}

.el-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #e0e7ff;
}

.star-icon {
    margin-left: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.star-icon:hover {
    background-color: #f1f5f9;
    color: #fbbf24;
}

.star-active {
    color: #fbbf24;
}

.star-active:hover {
    background-color: #fef3c7;
    color: #f59e0b;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
