<template>
    <div class="subscription-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>订阅管理</span>
                </div>
            </template>
            <el-table :data="subscriptions">
                <el-table-column prop="name" label="订阅名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                            {{ row.status === 'active' ? '已订阅' : '已取消' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="订阅时间" />
                <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                        <el-button v-if="row.status === 'active'" type="danger" size="small" link>
                            取消订阅
                        </el-button>
                        <el-button v-else type="primary" size="small" link>
                            重新订阅
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const subscriptions = ref([
    { name: '系统公告', type: '公告', status: 'active', createTime: '2026-01-20' },
    { name: '活动通知', type: '活动', status: 'active', createTime: '2026-01-15' },
    { name: '课程更新', type: '课程', status: 'inactive', createTime: '2026-01-10' }
])
</script>

<style scoped>
.subscription-container {
    padding: 20px;
}
</style>
