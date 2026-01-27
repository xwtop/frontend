<template>
    <div class="category-manage-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>分类管理</span>
                </div>
            </template>
            <div class="toolbar">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增分类</el-button>
            </div>
            <el-table :data="categories" row-key="id" :tree-props="{ children: 'children' }" default-expand-all>
                <el-table-column prop="name" label="分类名称" />
                <el-table-column prop="code" label="分类编码" width="150" />
                <el-table-column prop="type" label="所属类型" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="100" align="center" />
                <el-table-column prop="articleCount" label="文章数量" width="100" align="center" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link @click="handleAddChild(row)">新增子分类</el-button>
                        <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const categories = ref([
    {
        id: 1,
        name: '教务通知',
        code: 'jiaoWu',
        type: 'announcement',
        sort: 1,
        articleCount: 25,
        status: 1,
        children: [
            { id: 11, name: '选课通知', code: 'xuanKe', type: 'announcement', sort: 1, articleCount: 12, status: 1, children: [] },
            { id: 12, name: '考试安排', code: 'kaoShi', type: 'announcement', sort: 2, articleCount: 8, status: 1, children: [] },
            { id: 13, name: '成绩发布', code: 'chengJi', type: 'announcement', sort: 3, articleCount: 5, status: 1, children: [] }
        ]
    },
    {
        id: 2,
        name: '学工动态',
        code: 'xueGong',
        type: 'information',
        sort: 2,
        articleCount: 18,
        status: 1,
        children: [
            { id: 21, name: '学生活动', code: 'shengHuo', type: 'information', sort: 1, articleCount: 10, status: 1, children: [] },
            { id: 22, name: '社团动态', code: 'sheTuan', type: 'information', sort: 2, articleCount: 8, status: 1, children: [] }
        ]
    },
    {
        id: 3,
        name: '校园新闻',
        code: 'xiaoYuan',
        type: 'news',
        sort: 3,
        articleCount: 32,
        status: 1,
        children: [
            { id: 31, name: '学校要闻', code: 'yaoWen', type: 'news', sort: 1, articleCount: 15, status: 1, children: [] },
            { id: 32, name: '院系动态', code: 'yuanXi', type: 'news', sort: 2, articleCount: 17, status: 1, children: [] }
        ]
    },
    {
        id: 4,
        name: '学术讲座',
        code: 'xueShu',
        type: 'information',
        sort: 4,
        articleCount: 12,
        status: 1,
        children: []
    },
    {
        id: 5,
        name: '活动预告',
        code: 'huoDong',
        type: 'notice',
        sort: 5,
        articleCount: 8,
        status: 1,
        children: []
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

const handleAdd = () => {
    ElMessage.info('新增分类功能待实现')
}

const handleAddChild = (row) => {
    ElMessage.info(`新增子分类：${row.name}`)
}

const handleEdit = (row) => {
    ElMessage.info(`编辑分类：${row.name}`)
}

const handleDelete = (row) => {
    ElMessage.info(`删除分类：${row.name}`)
}
</script>

<style scoped>
.category-manage-container {
    padding: 20px;
}

.toolbar {
    margin-bottom: 20px;
}
</style>
