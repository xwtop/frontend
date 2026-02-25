<template>
    <div class="rank-list">
        <div v-for="item in data" :key="item.rank" class="rank-item" @click="handleItemClick(item)">
            <div class="rank-number" :class="'rank-' + item.rank">{{ item.rank }}</div>
            <div class="rank-content">
                <div class="rank-title">{{ item.title }}</div>
                <div class="rank-stats">
                    <span>👁️ {{ item.views }}</span>
                    <span>👍 {{ item.likes }}</span>
                    <span>💬 {{ item.comments || 0 }}</span>
                </div>
            </div>
        </div>
        
        <!-- 文章详情弹窗 -->
        <div v-if="showDetail" class="fixed inset-0 z-[2000]">
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleCloseDetail"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="w-full h-full max-w-full max-h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                    <ArticleDetail
                        :article-id="selectedArticleId"
                        @close="handleCloseDetail"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ArticleDetail from '@/components/ArticleDetail.vue'

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})

const showDetail = ref(false)
const selectedArticleId = ref(null)

const handleItemClick = (item) => {
    selectedArticleId.value = item.id
    showDetail.value = true
}

const handleCloseDetail = () => {
    showDetail.value = false
    selectedArticleId.value = null
}
</script>

<style scoped>
.rank-list {
    padding: 10px 0;
}

.rank-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ebeef5;
    transition: all 0.3s;
    cursor: pointer;
}

.rank-item:hover {
    background-color: #f5f7fa;
    transform: translateX(5px);
}

.rank-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    margin-right: 15px;
    background-color: #f0f0f0;
    color: #606266;
}

.rank-number.rank-1 {
    background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
    color: #fff;
}

.rank-number.rank-2 {
    background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
    color: #fff;
}

.rank-number.rank-3 {
    background: linear-gradient(135deg, #cd7f32 0%, #e6a86c 100%);
    color: #fff;
}

.rank-content {
    flex: 1;
}

.rank-title {
    font-size: 16px;
    color: #303133;
    margin-bottom: 8px;
}

.rank-stats span {
    margin-right: 20px;
    color: #909399;
    font-size: 14px;
}
</style>
