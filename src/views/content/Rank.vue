<template>
    <div class="content-rank-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>热榜排行</span>
                </div>
            </template>
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="日榜" name="daily">
                    <div v-if="loading" class="flex justify-center items-center py-8">
                        <el-icon class="is-loading" :size="32">
                            <Loading />
                        </el-icon>
                    </div>
                    <RankList v-else :data="dailyRank" />
                </el-tab-pane>
                <el-tab-pane label="周榜" name="weekly">
                    <div v-if="loading" class="flex justify-center items-center py-8">
                        <el-icon class="is-loading" :size="32">
                            <Loading />
                        </el-icon>
                    </div>
                    <RankList v-else :data="weeklyRank" />
                </el-tab-pane>
                <el-tab-pane label="月榜" name="monthly">
                    <div v-if="loading" class="flex justify-center items-center py-8">
                        <el-icon class="is-loading" :size="32">
                            <Loading />
                        </el-icon>
                    </div>
                    <RankList v-else :data="monthlyRank" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import RankList from './components/RankList.vue'
import { articleAPI } from '@/api/article'

const activeTab = ref('daily')
const loading = ref(false)

const dailyRank = ref([])
const weeklyRank = ref([])
const monthlyRank = ref([])

const loadRankData = async (timeRange) => {
    loading.value = true
    try {
        const res = await articleAPI.getRankArticles(timeRange, 10)
        if (res.data) {
            if (timeRange === 'daily') {
                dailyRank.value = res.data
            } else if (timeRange === 'weekly') {
                weeklyRank.value = res.data
            } else if (timeRange === 'monthly') {
                monthlyRank.value = res.data
            }
        }
    } catch (error) {
        console.error('加载热榜数据失败:', error)
    } finally {
        loading.value = false
    }
}

const handleTabChange = (tab) => {
    if (!dailyRank.value.length && tab === 'daily') {
        loadRankData('daily')
    } else if (!weeklyRank.value.length && tab === 'weekly') {
        loadRankData('weekly')
    } else if (!monthlyRank.value.length && tab === 'monthly') {
        loadRankData('monthly')
    }
}

onMounted(() => {
    loadRankData('daily')
})
</script>

<style scoped>
.content-rank-container {
    padding: 20px;
}
</style>
