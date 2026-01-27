<template>
    <div class="content-category-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>分类浏览</span>
                </div>
            </template>
            <el-row :gutter="20">
                <el-col :span="6" v-for="category in categories" :key="category.id">
                    <el-card shadow="hover" class="category-card">
                        <div class="category-icon">{{ category.icon }}</div>
                        <div class="category-name">{{ category.name }}</div>
                        <div class="category-count">{{ category.count }} 篇内容</div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
    { id: 1, name: '学术资源', icon: '📚', count: 128 },
    { id: 2, name: '校园新闻', icon: '📰', count: 256 },
    { id: 3, name: '活动通知', icon: '🎉', count: 89 },
    { id: 4, name: '学习资料', icon: '📖', count: 345 },
    { id: 5, name: '就业信息', icon: '💼', count: 167 },
    { id: 6, name: '生活服务', icon: '🏠', count: 234 },
    { id: 7, name: '社团活动', icon: '🎪', count: 98 },
    { id: 8, name: '科研动态', icon: '🔬', count: 156 }
])
</script>

<style scoped>
.content-category-container {
    padding: 20px;
}

.category-card {
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.category-card:hover {
    transform: translateY(-5px);
}

.category-icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.category-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.category-count {
    color: #909399;
    font-size: 14px;
}
</style>
