<template>
    <div class="bg-gradient-to-br from-slate-50 to-slate-100 w-full h-full flex">
        <div class="flex-1 flex lg:flex-row gap-2">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full lg:w-48 shrink-1">
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
                <el-tree
                    ref="categoryTreeRef"
                    :data="categories"
                    :props="treeProps"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :accordion="true"
                    :filter-node-method="filterNode"
                    node-key="id"
                    @node-click="handleNodeClick"
                />
            </div>

            <div class="flex-1 min-w-0">
                <div v-if="selectedCategory" class="bg-white/95 rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-slate-900">{{ selectedCategory.name }}</h2>
                        <div class="flex gap-2">
                            <button
                                v-for="sort in sortOptions"
                                :key="sort.value"
                                @click="handleSortChange(sort.value)"
                                :class="[
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                                    currentSort === sort.value
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                ]"
                            >
                                {{ sort.label }}
                            </button>
                        </div>
                    </div>

                    <div v-loading="loading" class="flex-1 overflow-y-auto min-h-0">
                        <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                            <article-display-card
                                v-for="article in articles"
                                :key="article.id"
                                :article="article"
                                @view="handleViewArticle"
                                class="break-inside-avoid mb-6"
                            />
                        </div>
                        
                        <div class="flex justify-center items-center py-12" v-if="!loading && articles.length === 0">
                            <el-empty description="暂无内容" />
                        </div>
                    </div>
                </div>
                <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
                    <div class="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FolderOpen class="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">选择一个分类</h3>
                    <p class="text-slate-600">点击左侧分类查看相关内容</p>
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryAPI } from '@/api/category'
import { articleAPI } from '@/api/article'
import {
    FolderOpen,
    Search
} from 'lucide-vue-next'
import ArticleDisplayCard from '@/components/ArticleDisplayCard.vue'
import ArticleDetail from '@/components/ArticleDetail.vue'

const router = useRouter()

const categoryTreeRef = ref(null)
const categories = ref([])
const selectedCategory = ref(null)
const currentSort = ref('latest')
const articles = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterText = ref('')
const detailVisible = ref(false)
const currentDetailArticleId = ref(null)

const treeProps = {
    children: 'children',
    label: 'name'
}

const sortOptions = [
    { label: '最新', value: 'latest' },
    { label: '热门', value: 'popular' },
    { label: '最多浏览', value: 'views' }
]

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
            categories.value = processCategories(res.data)
        }
    } catch (error) {
        console.error('加载分类失败:', error)
    } finally {
        loading.value = false
    }
}

const processCategories = (tree) => {
    const processNode = (node) => {
        return {
            ...node,
            children: node.children ? node.children.map(processNode) : []
        }
    }
    return tree.map(node => processNode(node))
}

const handleNodeClick = (data) => {
    selectedCategory.value = data
    currentPage.value = 1
    loadArticles()
}

const handleSortChange = (sort) => {
    currentSort.value = sort
    currentPage.value = 1
    loadArticles()
}

const handlePageChange = (page) => {
    currentPage.value = page
    loadArticles()
}

const handleSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
    loadArticles()
}

const loadArticles = async () => {
    if (!selectedCategory.value) return

    try {
        loading.value = true
        const params = {
            page: currentPage.value,
            page_size: pageSize.value,
            category_id: selectedCategory.value.id,
            status: 1
        }

        if (currentSort.value === 'hot') {
            params.is_hot = 1
        } else if (currentSort.value === 'views') {
            params.sort = 'view_count'
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
            total.value = res.data.total || 0
        }
    } catch (error) {
        console.error('加载文章失败:', error)
        articles.value = []
        total.value = 0
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

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

onMounted(() => {
    loadCategories()
})
</script>

<style scoped>
.el-tree :deep(.el-tree-node__label) {
    font-size: 15px;
}
</style>
