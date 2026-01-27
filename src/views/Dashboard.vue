<template>
    <div class="dashboard">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">总用户数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalUsers }}</div>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#3b82f6"><User /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">今日新增</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.todayNewUsers }}</div>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#10b981"><UserFilled /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">资讯总数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalNews }}</div>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#8b5cf6"><Document /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">公告总数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalAnnouncements }}</div>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#f97316"><Bell /></el-icon>
                    </div>
                </div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <el-card>
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold">最新资讯</span>
                        <el-button type="primary" link>查看更多</el-button>
                    </div>
                </template>
                <el-table :data="recentNews" stripe>
                    <el-table-column prop="title" label="标题" />
                    <el-table-column prop="category" label="分类" width="120" />
                    <el-table-column prop="views" label="浏览量" width="100" />
                    <el-table-column prop="createTime" label="发布时间" width="180" />
                </el-table>
            </el-card>

            <el-card>
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold">最新公告</span>
                        <el-button type="primary" link>查看更多</el-button>
                    </div>
                </template>
                <el-table :data="recentAnnouncements" stripe>
                    <el-table-column prop="title" label="标题" />
                    <el-table-column prop="priority" label="优先级" width="100">
                        <template #default="{ row }">
                            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'">
                                {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发布时间" width="180" />
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, UserFilled, Document, Bell } from '@element-plus/icons-vue'

const stats = ref({
    totalUsers: 0,
    todayNewUsers: 0,
    totalNews: 0,
    totalAnnouncements: 0
})

const recentNews = ref([
    { title: '2024年四六级考试通知', category: '考试', views: 1234, createTime: '2024-01-27 10:00:00' },
    { title: '考研复试安排公告', category: '考研', views: 987, createTime: '2024-01-26 15:30:00' },
    { title: '图书馆开放时间调整通知', category: '校园', views: 654, createTime: '2024-01-25 09:00:00' },
    { title: '春季学期选课通知', category: '教务', views: 543, createTime: '2024-01-24 14:20:00' },
    { title: '校园招聘会信息', category: '就业', views: 432, createTime: '2024-01-23 11:00:00' }
])

const recentAnnouncements = ref([
    { title: '关于寒假放假安排的通知', priority: 'high', createTime: '2024-01-20 10:00:00' },
    { title: '校园网络安全升级维护通知', priority: 'high', createTime: '2024-01-19 09:00:00' },
    { title: '新学期开学报到须知', priority: 'medium', createTime: '2024-01-18 14:00:00' },
    { title: '校园卡充值系统维护通知', priority: 'low', createTime: '2024-01-17 16:00:00' },
    { title: '关于举办校园文化活动的通知', priority: 'medium', createTime: '2024-01-16 10:00:00' }
])

onMounted(() => {
    stats.value = {
        totalUsers: 1234,
        todayNewUsers: 12,
        totalNews: 567,
        totalAnnouncements: 89
    }
})
</script>

<style scoped>
.stat-card {
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}
</style>
