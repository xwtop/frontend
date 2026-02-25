<template>
    <div class="dashboard">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">总用户数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalUsers }}</div>
                        <div class="text-xs text-green-600 mt-1">今日新增 +{{ stats.todayNewUsers }}</div>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#3b82f6"><User /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">文章总数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalArticles }}</div>
                        <div class="text-xs text-green-600 mt-1">今日新增 +{{ stats.todayNewArticles }}</div>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#10b981"><Document /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">总评论数</div>
                        <div class="text-3xl font-bold text-slate-900">{{ stats.totalComments }}</div>
                        <div class="text-xs text-slate-400 mt-1">互动活跃</div>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#8b5cf6"><ChatDotRound /></el-icon>
                    </div>
                </div>
            </el-card>

            <el-card class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-slate-500 text-sm mb-1">总浏览量</div>
                        <div class="text-3xl font-bold text-slate-900">{{ formatNumber(stats.totalViews) }}</div>
                        <div class="text-xs text-slate-400 mt-1">累计浏览</div>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <el-icon :size="24" color="#f97316"><View /></el-icon>
                    </div>
                </div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <el-card>
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold">用户增长趋势</span>
                        <el-select v-model="userTrendDays" size="small" style="width: 100px" @change="loadUserTrend">
                            <el-option label="7天" :value="7" />
                            <el-option label="30天" :value="30" />
                        </el-select>
                    </div>
                </template>
                <div ref="userTrendChart" class="chart-container"></div>
            </el-card>

            <el-card>
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-semibold">文章发布趋势</span>
                        <el-select v-model="articleTrendDays" size="small" style="width: 100px" @change="loadArticleTrend">
                            <el-option label="7天" :value="7" />
                            <el-option label="30天" :value="30" />
                        </el-select>
                    </div>
                </template>
                <div ref="articleTrendChart" class="chart-container"></div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <el-card>
                <template #header>
                    <span class="text-lg font-semibold">分类统计</span>
                </template>
                <div ref="categoryChart" class="chart-container"></div>
            </el-card>

            <el-card>
                <template #header>
                    <span class="text-lg font-semibold">浏览量趋势</span>
                </template>
                <div ref="viewTrendChart" class="chart-container"></div>
            </el-card>

            <el-card>
                <template #header>
                    <span class="text-lg font-semibold">24小时活跃度</span>
                </template>
                <div ref="hourlyChart" class="chart-container"></div>
            </el-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <el-card>
                <template #header>
                    <span class="text-lg font-semibold">热门文章</span>
                </template>
                <el-table :data="hotArticles" stripe>
                    <el-table-column prop="title" label="标题" show-overflow-tooltip />
                    <el-table-column prop="viewCount" label="浏览量" width="100" />
                    <el-table-column prop="likeCount" label="点赞" width="80" />
                    <el-table-column prop="commentCount" label="评论" width="80" />
                    <el-table-column prop="categoryName" label="分类" width="100" />
                </el-table>
            </el-card>

            <el-card>
                <template #header>
                    <span class="text-lg font-semibold">活跃用户</span>
                </template>
                <el-table :data="activeUsers" stripe>
                    <el-table-column prop="username" label="学号" width="120" />
                    <el-table-column prop="realName" label="姓名" width="100" />
                    <el-table-column prop="articleCount" label="文章数" width="100">
                        <template #default="{ row }">
                            <el-tag type="success">{{ row.articleCount }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalLikes" label="总点赞" width="100">
                        <template #default="{ row }">
                            <el-tag type="danger">{{ row.totalLikes }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalComments" label="总评论" width="100">
                        <template #default="{ row }">
                            <el-tag type="warning">{{ row.totalComments }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalViews" label="总浏览" width="100">
                        <template #default="{ row }">
                            <el-tag type="info">{{ row.totalViews }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { User, Document, ChatDotRound, View } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { dashboardAPI } from '@/api/dashboard'

const stats = ref({
    totalUsers: 0,
    todayNewUsers: 0,
    totalArticles: 0,
    todayNewArticles: 0,
    totalComments: 0,
    totalLikes: 0,
    totalViews: 0
})

const userTrendDays = ref(7)
const articleTrendDays = ref(7)
const hotArticles = ref([])
const activeUsers = ref([])

const userTrendChart = ref(null)
const articleTrendChart = ref(null)
const categoryChart = ref(null)
const viewTrendChart = ref(null)
const hourlyChart = ref(null)

let userTrendChartInstance = null
let articleTrendChartInstance = null
let categoryChartInstance = null
let viewTrendChartInstance = null
let hourlyChartInstance = null

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
    }
    return num
}

async function loadStats() {
    const response = await dashboardAPI.getStats()
    stats.value = response.data
}

async function loadUserTrend() {
    const response = await dashboardAPI.getUserTrend(userTrendDays.value)
    const data = response.data
    const dates = data.map(item => item.date.slice(5))
    const counts = data.map(item => item.count)
    
    if (userTrendChartInstance) {
        userTrendChartInstance.setOption({
            xAxis: { data: dates },
            series: [{ data: counts }]
        })
    }
}

async function loadArticleTrend() {
    const response = await dashboardAPI.getArticleTrend(articleTrendDays.value)
    const data = response.data
    const dates = data.map(item => item.date.slice(5))
    const counts = data.map(item => item.count)
    
    if (articleTrendChartInstance) {
        articleTrendChartInstance.setOption({
            xAxis: { data: dates },
            series: [{ data: counts }]
        })
    }
}

async function loadCategoryStats() {
    const response = await dashboardAPI.getCategoryStats()
    const data = response.data
    const names = data.map(item => item.categoryName)
    const counts = data.map(item => item.articleCount)
    
    if (categoryChartInstance) {
        categoryChartInstance.setOption({
            series: [{ data: counts.map((count, index) => ({ value: count, name: names[index] })) }]
        })
    }
}

async function loadViewTrend() {
    const response = await dashboardAPI.getViewTrend(7)
    const data = response.data
    const dates = data.map(item => item.date.slice(5))
    const counts = data.map(item => item.count)
    
    if (viewTrendChartInstance) {
        viewTrendChartInstance.setOption({
            xAxis: { data: dates },
            series: [{ data: counts }]
        })
    }
}

async function loadHotArticles() {
    const response = await dashboardAPI.getHotArticles(10)
    hotArticles.value = response.data
}

async function loadActiveUsers() {
    const response = await dashboardAPI.getActiveUsers(10)
    activeUsers.value = response.data
}

async function loadHourlyActivity() {
    const response = await dashboardAPI.getHourlyActivity()
    const data = response.data
    const hours = data.map(item => item.hour)
    const articleCounts = data.map(item => item.articleCount)
    const commentCounts = data.map(item => item.commentCount)
    
    if (hourlyChartInstance) {
        hourlyChartInstance.setOption({
            xAxis: { data: hours },
            series: [
                { data: articleCounts },
                { data: commentCounts }
            ]
        })
    }
}

function initCharts() {
    userTrendChartInstance = echarts.init(userTrendChart.value)
    articleTrendChartInstance = echarts.init(articleTrendChart.value)
    categoryChartInstance = echarts.init(categoryChart.value)
    viewTrendChartInstance = echarts.init(viewTrendChart.value)
    hourlyChartInstance = echarts.init(hourlyChart.value)

    const commonOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
    }

    userTrendChartInstance.setOption({
        ...commonOption,
        xAxis: { type: 'category', boundaryGap: false, data: [] },
        yAxis: { type: 'value' },
        series: [{
            name: '新增用户',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 },
            itemStyle: { color: '#3b82f6' },
            data: []
        }]
    })

    articleTrendChartInstance.setOption({
        ...commonOption,
        xAxis: { type: 'category', boundaryGap: false, data: [] },
        yAxis: { type: 'value' },
        series: [{
            name: '新增文章',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 },
            itemStyle: { color: '#10b981' },
            data: []
        }]
    })

    categoryChartInstance.setOption({
        tooltip: { trigger: 'item' },
        series: [{
            name: '文章数量',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    })

    viewTrendChartInstance.setOption({
        ...commonOption,
        xAxis: { type: 'category', boundaryGap: false, data: [] },
        yAxis: { type: 'value' },
        series: [{
            name: '浏览量',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 },
            itemStyle: { color: '#f97316' },
            data: []
        }]
    })

    hourlyChartInstance.setOption({
        ...commonOption,
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [
            {
                name: '文章',
                type: 'bar',
                itemStyle: { color: '#8b5cf6' },
                data: []
            },
            {
                name: '评论',
                type: 'bar',
                itemStyle: { color: '#ec4899' },
                data: []
            }
        ]
    })
}

function handleResize() {
    userTrendChartInstance?.resize()
    articleTrendChartInstance?.resize()
    categoryChartInstance?.resize()
    viewTrendChartInstance?.resize()
    hourlyChartInstance?.resize()
}

onMounted(async () => {
    await nextTick()
    initCharts()
    await Promise.all([
        loadStats(),
        loadUserTrend(),
        loadArticleTrend(),
        loadCategoryStats(),
        loadViewTrend(),
        loadHotArticles(),
        loadActiveUsers(),
        loadHourlyActivity()
    ])
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    userTrendChartInstance?.dispose()
    articleTrendChartInstance?.dispose()
    categoryChartInstance?.dispose()
    viewTrendChartInstance?.dispose()
    hourlyChartInstance?.dispose()
    window.removeEventListener('resize', handleResize)
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

.chart-container {
    width: 100%;
    height: 300px;
}
</style>
