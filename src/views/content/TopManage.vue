<template>
    <div class="top-manage-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>置顶管理</span>
                </div>
            </template>
            <el-table :data="topArticles">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="文章标题" show-overflow-tooltip />
                <el-table-column prop="type" label="类型" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="分类" width="120" align="center" />
                <el-table-column prop="author" label="作者" width="100" align="center" />
                <el-table-column prop="topTime" label="置顶时间" width="180" align="center" />
                <el-table-column prop="expireTime" label="到期时间" width="180" align="center" />
                <el-table-column label="操作" width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link>编辑</el-button>
                        <el-button type="danger" size="small" link @click="handleCancelTop(row)">取消置顶</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const topArticles = ref([
    {
        id: 1,
        title: '2026年春季学期选课通知',
        type: 'announcement',
        category: '教务通知',
        author: '教务处',
        topTime: '2026-01-25 10:00:00',
        expireTime: '2026-02-05 23:59:59'
    },
    {
        id: 2,
        title: '校园智慧平台使用指南',
        type: 'information',
        category: '学工动态',
        author: '信息中心',
        topTime: '2026-01-24 15:30:00',
        expireTime: '2026-01-30 23:59:59'
    }
])

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

const handleCancelTop = (row) => {
    ElMessageBox.confirm(`确定要取消 "${row.title}" 的置顶吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('已取消置顶')
    }).catch(() => {})
}
</script>

<style scoped>
.top-manage-container {
    padding: 20px;
}
</style>
