<template>
    <div class="content-rank-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>热榜排行</span>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="日榜" name="daily">
                    <RankList :data="dailyRank" />
                </el-tab-pane>
                <el-tab-pane label="周榜" name="weekly">
                    <RankList :data="weeklyRank" />
                </el-tab-pane>
                <el-tab-pane label="月榜" name="monthly">
                    <RankList :data="monthlyRank" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import RankList from './components/RankList.vue'

const activeTab = ref('daily')

const dailyRank = ref([
    { rank: 1, title: '2026年寒假放假安排', views: 12345, likes: 890 },
    { rank: 2, title: '校园智慧平台全新上线', views: 9876, likes: 756 },
    { rank: 3, title: '图书馆开放时间调整通知', views: 7654, likes: 543 },
    { rank: 4, title: '学生社团招新活动', views: 6543, likes: 432 },
    { rank: 5, title: '奖学金评定办法说明', views: 5432, likes: 321 }
])

const weeklyRank = ref([
    { rank: 1, title: '2026年寒假放假安排', views: 45678, likes: 3456 },
    { rank: 2, title: '校园智慧平台全新上线', views: 34567, likes: 2345 },
    { rank: 3, title: '图书馆开放时间调整通知', views: 23456, likes: 1234 },
    { rank: 4, title: '学生社团招新活动', views: 12345, likes: 987 },
    { rank: 5, title: '奖学金评定办法说明', views: 9876, likes: 654 }
])

const monthlyRank = ref([
    { rank: 1, title: '2026年寒假放假安排', views: 123456, likes: 8765 },
    { rank: 2, title: '校园智慧平台全新上线', views: 98765, likes: 6543 },
    { rank: 3, title: '图书馆开放时间调整通知', views: 76543, likes: 4321 },
    { rank: 4, title: '学生社团招新活动', views: 54321, likes: 3210 },
    { rank: 5, title: '奖学金评定办法说明', views: 43210, likes: 2109 }
])
</script>

<style scoped>
.content-rank-container {
    padding: 20px;
}
</style>
