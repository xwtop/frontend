<template>
    <div class="article-list-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>内容列表</span>
                </div>
            </template>
            <el-form :inline="true" :model="queryForm" class="search-form">
                <el-form-item label="文章标题">
                    <el-input v-model="queryForm.title" placeholder="请输入标题" clearable style="width: 180px" />
                </el-form-item>
                <el-form-item label="文章类型">
                    <el-select v-model="queryForm.type" placeholder="全部" clearable style="width: 120px">
                        <el-option label="公告" value="announcement" />
                        <el-option label="资讯" value="information" />
                        <el-option label="新闻" value="news" />
                        <el-option label="通知" value="notice" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布状态">
                    <el-select v-model="queryForm.status" placeholder="全部" clearable style="width: 120px">
                        <el-option label="已发布" value="published" />
                        <el-option label="草稿" value="draft" />
                        <el-option label="已下架" value="unpublished" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                    <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" v-loading="loading">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="文章标题" show-overflow-tooltip />
                <el-table-column prop="type" label="类型" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="分类" width="120" align="center" />
                <el-table-column prop="author" label="作者" width="100" align="center" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusColor(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isTop" label="置顶" width="80" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.isTop" type="warning" size="small">已置顶</el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180" align="center" />
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link>编辑</el-button>
                        <el-button v-if="row.status === 'published'" type="warning" size="small" link>
                            下架
                        </el-button>
                        <el-button v-else type="success" size="small" link>发布</el-button>
                        <el-button type="danger" size="small" link>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-model:current-page="queryForm.page"
                v-model:page-size="queryForm.page_size"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSearch"
                @current-change="handleSearch"
                class="mt-4 justify-end"
            />
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const loading = ref(false)
const total = ref(0)

const queryForm = reactive({
    title: '',
    type: '',
    status: '',
    page: 1,
    page_size: 10
})

const tableData = ref([
    {
        id: 1,
        title: '2026年春季学期选课通知',
        type: 'announcement',
        category: '教务通知',
        author: '教务处',
        status: 'published',
        isTop: true,
        publishTime: '2026-01-25 10:00:00'
    },
    {
        id: 2,
        title: '校园智慧平台使用指南',
        type: 'information',
        category: '学工动态',
        author: '信息中心',
        status: 'published',
        isTop: false,
        publishTime: '2026-01-24 15:30:00'
    },
    {
        id: 3,
        title: '学校召开2026年度工作总结大会',
        type: 'news',
        category: '校园新闻',
        author: '宣传部',
        status: 'published',
        isTop: false,
        publishTime: '2026-01-23 14:20:00'
    },
    {
        id: 4,
        title: '图书馆寒假开放时间通知',
        type: 'notice',
        category: '教务通知',
        author: '图书馆',
        status: 'draft',
        isTop: false,
        publishTime: '-'
    }
])

total.value = 50

const getTypeColor = (type) => {
    const colors = {
        announcement: 'primary',
        information: 'success',
        news: 'warning',
        notice: 'danger'
    }
    return colors[type] || 'info'
}

const getTypeLabel = (type) => {
    const labels = {
        announcement: '公告',
        information: '资讯',
        news: '新闻',
        notice: '通知'
    }
    return labels[type] || type
}

const getStatusColor = (status) => {
    const colors = {
        published: 'success',
        draft: 'info',
        unpublished: 'warning'
    }
    return colors[status] || 'info'
}

const getStatusLabel = (status) => {
    const labels = {
        published: '已发布',
        draft: '草稿',
        unpublished: '已下架'
    }
    return labels[status] || status
}

const handleSearch = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 500)
}

const handleReset = () => {
    queryForm.title = ''
    queryForm.type = ''
    queryForm.status = ''
    queryForm.page = 1
    handleSearch()
}

onMounted(() => {
    handleSearch()
})
</script>

<style scoped>
.article-list-container {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
}

.search-form :deep(.el-form-item) {
    margin-bottom: 0;
}
</style>
