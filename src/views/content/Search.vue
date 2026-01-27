<template>
    <div class="content-search-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>智能检索</span>
                </div>
            </template>
            <el-input
                v-model="searchKeyword"
                placeholder="请输入关键词搜索内容"
                size="large"
                clearable
                @keyup.enter="handleSearch"
            >
                <template #append>
                    <el-button :icon="Search" @click="handleSearch">搜索</el-button>
                </template>
            </el-input>
            <div class="search-filters">
                <el-radio-group v-model="searchType">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="title">标题</el-radio-button>
                    <el-radio-button label="content">内容</el-radio-button>
                    <el-radio-button label="author">作者</el-radio-button>
                </el-radio-group>
            </div>
            <div class="search-results">
                <el-empty v-if="searchResults.length === 0" description="暂无搜索结果" />
                <div v-else>
                    <div v-for="item in searchResults" :key="item.id" class="result-item">
                        <h3>{{ item.title }}</h3>
                        <p class="result-summary">{{ item.summary }}</p>
                        <div class="result-meta">
                            <span>{{ item.author }}</span>
                            <span>{{ item.publishTime }}</span>
                            <span>{{ item.category }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const searchType = ref('all')
const searchResults = ref([])

const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
        searchResults.value = []
        return
    }
    
    searchResults.value = [
        {
            id: 1,
            title: '校园智慧平台使用指南',
            summary: '详细介绍校园智慧平台的各项功能和使用方法，帮助学生快速上手...',
            author: '管理员',
            publishTime: '2026-01-25',
            category: '学术资源'
        },
        {
            id: 2,
            title: '2026年春季学期选课通知',
            summary: '关于2026年春季学期选课时间、流程和注意事项的详细说明...',
            author: '教务处',
            publishTime: '2026-01-20',
            category: '校园新闻'
        }
    ]
}
</script>

<style scoped>
.content-search-container {
    padding: 20px;
}

.search-filters {
    margin: 20px 0;
}

.result-item {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
}

.result-item:hover {
    background-color: #f5f7fa;
}

.result-item h3 {
    margin: 0 0 10px 0;
    color: #303133;
}

.result-summary {
    color: #606266;
    margin: 0 0 10px 0;
}

.result-meta span {
    margin-right: 20px;
    color: #909399;
    font-size: 14px;
}
</style>
