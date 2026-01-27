<template>
    <div class="content-favorites-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>我的收藏</span>
                </div>
            </template>
            <el-table :data="favorites">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="category" label="分类" width="120" />
                <el-table-column prop="author" label="作者" width="120" />
                <el-table-column prop="collectTime" label="收藏时间" width="180" />
                <el-table-column label="操作" width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link>查看</el-button>
                        <el-button type="danger" size="small" link>取消收藏</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const favorites = ref([
    { title: '校园智慧平台使用指南', category: '学术资源', author: '管理员', collectTime: '2026-01-25 10:30:00' },
    { title: '2026年春季学期选课通知', category: '校园新闻', author: '教务处', collectTime: '2026-01-20 15:20:00' },
    { title: '图书馆开放时间调整通知', category: '生活服务', author: '图书馆', collectTime: '2026-01-15 09:10:00' }
])
</script>

<style scoped>
.content-favorites-container {
    padding: 20px;
}
</style>
