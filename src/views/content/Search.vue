<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <el-card class="rounded-2xl shadow-md border border-slate-200">
            <div class="relative py-6">
                <div class="max-w-[600px] mx-auto transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]" :class="{ 'max-w-[800px]': isInputExpanded }">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="请输入关键词搜索内容"
                        size="large"
                        clearable
                        @keyup.enter="handleSearch"
                        @focus="handleInputFocus"
                        @blur="handleInputBlur"
                        class="search-input"
                    >
                        <template #append>
                            <el-button 
                                :icon="Search" 
                                @click="handleSearch"
                                :loading="loading"
                                class="search-button"
                            >
                                搜索
                            </el-button>
                        </template>
                    </el-input>
                </div>
                
                <transition name="history-slide">
                    <div v-if="showHistory && searchHistory.length > 0" class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white rounded-xl shadow-lg p-4 mt-2 z-[1000] border border-slate-200">
                        <div class="flex justify-between items-center mb-3 font-semibold text-slate-700 text-sm">
                            <span>搜索历史</span>
                            <el-button link @click="clearHistory">清空</el-button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <transition-group name="tag-fade">
                                <el-tag
                                    v-for="(item, index) in searchHistory"
                                    :key="item"
                                    @click="handleHistoryClick(item)"
                                    class="history-tag cursor-pointer transition-all duration-200 ease rounded-lg px-3 py-1.5 text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(37,99,235,0.2)]"
                                    closable
                                    @close="removeHistoryItem(index)"
                                >
                                    {{ item }}
                                </el-tag>
                            </transition-group>
                        </div>
                    </div>
                </transition>
            </div>
            
            <div class="px-6 pb-6 flex justify-center">
                <el-radio-group v-model="searchType" size="default" class="flex gap-2">
                    <el-radio-button value="all" class="rounded-lg font-medium px-5 py-2 transition-all duration-300 ease hover:-translate-y-0.5">全部</el-radio-button>
                    <el-radio-button value="title" class="rounded-lg font-medium px-5 py-2 transition-all duration-300 ease hover:-translate-y-0.5">标题</el-radio-button>
                    <el-radio-button value="content" class="rounded-lg font-medium px-5 py-2 transition-all duration-300 ease hover:-translate-y-0.5">内容</el-radio-button>
                    <el-radio-button value="author" class="rounded-lg font-medium px-5 py-2 transition-all duration-300 ease hover:-translate-y-0.5">作者</el-radio-button>
                </el-radio-group>
            </div>
            
            <div class="px-6 min-h-[400px]">
                <el-empty v-if="!loading && searchResults.length === 0" description="暂无搜索结果" />
                
                <div v-if="loading" class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                    <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-5 border border-slate-200 flex gap-4">
                        <div class="w-20 h-20 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer flex-shrink-0"></div>
                        <div class="flex-1 flex flex-col gap-3">
                            <div class="h-6 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                            <div class="h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                            <div class="h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer w-[60%]"></div>
                        </div>
                    </div>
                </div>
                
                <div v-if="!loading && searchResults.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                    <div 
                        v-for="item in searchResults" 
                        :key="item.id"
                        class="bg-white rounded-xl p-5 border border-slate-200 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex gap-4 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:border-blue-600 active:-translate-y-1"
                        @click="handleCardClick(item)"
                    >
                        <div class="w-20 h-20 flex-shrink-0">
                            <div class="w-full h-full rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-all duration-300 ease hover:scale-110 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]">
                                <span class="text-white text-4xl font-bold">{{ item.category?.charAt(0) || '文' }}</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0 flex flex-col">
                            <h3 class="m-0 mb-2 text-lg font-semibold text-slate-800 leading-[1.4] overflow-hidden text-ellipsis line-clamp-2 transition-colors duration-300 ease hover:text-blue-600" v-html="highlightKeyword(item.title)"></h3>
                            <p class="m-0 mb-3 text-sm text-slate-500 leading-[1.6] overflow-hidden text-ellipsis line-clamp-2" v-html="highlightKeyword(item.summary)"></p>
                            <div class="flex items-center gap-3 flex-wrap">
                                <el-tag size="small" type="info">{{ item.category }}</el-tag>
                                <span class="flex items-center gap-1 text-xs text-slate-400 transition-colors duration-300 ease hover:text-slate-500">
                                    <el-icon><User /></el-icon>
                                    {{ item.author }}
                                </span>
                                <span class="flex items-center gap-1 text-xs text-slate-400 transition-colors duration-300 ease hover:text-slate-500">
                                    <el-icon><Clock /></el-icon>
                                    {{ item.publishTime }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        
        <!-- 全屏文章详情 -->
        <transition name="detail-fade">
            <div v-if="showArticleDetail" class="fixed inset-0 z-[2000]">
                <div class="absolute inset-0 bg-black/50" @click="handleCloseArticleDetail"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4">
                    <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                        <ArticleDetail
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
import { ref, onMounted } from 'vue'
import { Search, User, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { articleAPI } from '@/api/article'
import ArticleDetail from '@/components/ArticleDetail.vue'

const searchKeyword = ref('')
const searchType = ref('all')
const searchResults = ref([])
const loading = ref(false)
const showHistory = ref(false)
const searchHistory = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showArticleDetail = ref(false)
const selectedArticleId = ref('')
const isInputExpanded = ref(false)

const STORAGE_KEY = 'search_history'

onMounted(() => {
    loadSearchHistory()
})

const loadSearchHistory = () => {
    try {
        const history = localStorage.getItem(STORAGE_KEY)
        if (history) {
            searchHistory.value = JSON.parse(history)
        }
    } catch (error) {
        console.error('加载搜索历史失败', error)
    }
}

const saveSearchHistory = (keyword) => {
    try {
        const index = searchHistory.value.indexOf(keyword)
        if (index > -1) {
            searchHistory.value.splice(index, 1)
        }
        searchHistory.value.unshift(keyword)
        if (searchHistory.value.length > 10) {
            searchHistory.value = searchHistory.value.slice(0, 10)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value))
    } catch (error) {
        console.error('保存搜索历史失败', error)
    }
}

const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem(STORAGE_KEY)
    ElMessage.success('搜索历史已清空')
}

const removeHistoryItem = (index) => {
    searchHistory.value.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value))
}

const handleHistoryClick = (keyword) => {
    searchKeyword.value = keyword
    showHistory.value = false
    handleSearch()
}

const handleInputFocus = () => {
    showHistory.value = true
    isInputExpanded.value = true
}

const handleInputBlur = () => {
    setTimeout(() => {
        showHistory.value = false
        isInputExpanded.value = false
    }, 200)
}

const highlightKeyword = (text) => {
    if (!searchKeyword.value || !text) return text
    const keyword = searchKeyword.value.trim()
    if (!keyword) return text
    
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, '<mark class="highlight">$1</mark>')
}

const handleSearch = async () => {
    const keyword = searchKeyword.value.trim()
    if (!keyword) {
        searchResults.value = []
        total.value = 0
        return
    }
    
    loading.value = true
    showHistory.value = false
    currentPage.value = 1
    
    try {
        const res = await articleAPI.search(
            keyword,
            searchType.value,
            currentPage.value,
            pageSize.value
        )
        
        if (res.status === 200) {
            searchResults.value = res.data.items || []
            total.value = res.data.total || 0
            saveSearchHistory(keyword)
        } else {
            ElMessage.error('搜索失败，请稍后重试')
        }
    } catch (error) {
        console.error('搜索失败', error)
        ElMessage.error('搜索失败，请稍后重试')
    } finally {
        loading.value = false
    }
}

const handleCardClick = (item) => {
    selectedArticleId.value = item.id
    showArticleDetail.value = true
}

const handleCloseArticleDetail = () => {
    showArticleDetail.value = false
    selectedArticleId.value = ''
}
</script>

<style scoped>
.search-input {
    font-size: 1rem;
}

.search-input :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 2px solid #E2E8F0;
    transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
    border-color: #94A3B8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.search-input :deep(.el-input__wrapper.is-focus) {
    border-color: #2563EB;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.search-button {
    border-radius: 0 12px 12px 0;
    font-weight: 600;
    padding: 0 1.5rem;
    transition: all 0.3s ease;
}

.search-button:hover {
    transform: scale(1.05);
}

.search-button:active {
    transform: scale(0.95);
}

.search-filters :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: #2563EB;
    border-color: #2563EB;
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.highlight {
    background: #FEF3C7;
    color: #92400E;
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 600;
}

.history-slide-enter-active,
.history-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.history-slide-enter-from,
.history-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
}

.tag-fade-enter-active,
.tag-fade-leave-active {
    transition: all 0.2s ease;
}

.tag-fade-enter-from,
.tag-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.filter-slide-enter-active,
.filter-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-slide-enter-from,
.filter-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.detail-fade-enter-active,
.detail-fade-leave-active {
    transition: all 0.3s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
    opacity: 0;
}

.detail-fade-enter-to .absolute.inset-0.bg-black {
    animation: fadeIn 0.3s ease;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .search-filters :deep(.el-radio-group) {
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>
