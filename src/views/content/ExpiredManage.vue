<template>
    <div class="expired-manage-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>过期内容</span>
                </div>
            </template>
            <el-table :data="expiredArticles">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="文章标题" show-overflow-tooltip />
                <el-table-column prop="type" label="类型" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="分类" width="120" align="center" />
                <el-table-column prop="author" label="作者" width="100" align="center" />
                <el-table-column prop="publishTime" label="发布时间" width="180" align="center" />
                <el-table-column prop="expireTime" label="过期时间" width="180" align="center" />
                <el-table-column label="操作" width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link>查看详情</el-button>
                        <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const expiredArticles = ref([
    {
        id: 1,
        title: '2025年秋季学期选课通知',
        type: 'announcement',
        category: '教务通知',
        author: '教务处',
        publishTime: '2025-08-20 10:00:00',
        expireTime: '2025-09-10 23:59:59'
    },
    {
        id: 2,
        title: '2025年新生入学须知',
        type: 'notice',
        category: '教务通知',
        author: '招生办',
        publishTime: '2025-07-15 14:00:00',
        expireTime: '2025-09-01 23:59:59'
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

const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除 "${row.title}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('删除成功')
    }).catch(() => {})
}
</script>

<style scoped>
.expired-manage-container {
    padding: 20px;
}
</style>
