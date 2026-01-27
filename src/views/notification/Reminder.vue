<template>
    <div class="notification-reminder-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>定时提醒</span>
                </div>
            </template>
            <div class="toolbar">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增提醒</el-button>
            </div>
            <el-table :data="reminders">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="提醒标题" />
                <el-table-column prop="content" label="提醒内容" show-overflow-tooltip />
                <el-table-column prop="remindTime" label="提醒时间" width="180" />
                <el-table-column prop="repeat" label="重复方式" width="120">
                    <template #default="{ row }">
                        <el-tag :type="getRepeatColor(row.repeat)">{{ getRepeatLabel(row.repeat) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                            {{ row.status === 'active' ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
                        <el-button :type="row.status === 'active' ? 'warning' : 'success'" size="small" link @click="handleToggleStatus(row)">
                            {{ row.status === 'active' ? '禁用' : '启用' }}
                        </el-button>
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

const reminders = ref([
    { title: '提交作业', content: '数据结构课程作业截止', remindTime: '2026-01-28 23:59:59', repeat: 'once', status: 'active' },
    { title: '课程提醒', content: '每周三下午3点有数据结构课程', remindTime: '2026-02-02 15:00:00', repeat: 'weekly', status: 'active' },
    { title: '会议提醒', content: '社团例会', remindTime: '2026-01-30 19:00:00', repeat: 'monthly', status: 'inactive' }
])

const getRepeatColor = (repeat) => {
    const colors = {
        once: 'primary',
        daily: 'success',
        weekly: 'warning',
        monthly: 'danger'
    }
    return colors[repeat] || 'info'
}

const getRepeatLabel = (repeat) => {
    const labels = {
        once: '一次性',
        daily: '每天',
        weekly: '每周',
        monthly: '每月'
    }
    return labels[repeat] || repeat
}

const handleAdd = () => {
    ElMessage.info('新增提醒功能待实现')
}

const handleEdit = (row) => {
    ElMessage.info(`编辑提醒：${row.title}`)
}

const handleToggleStatus = (row) => {
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`提醒已${row.status === 'active' ? '启用' : '禁用'}`)
}

const handleDelete = (row) => {
    ElMessage.success(`删除提醒：${row.title}`)
}
</script>

<style scoped>
.notification-reminder-container {
    padding: 20px;
}

.toolbar {
    margin-bottom: 20px;
}
</style>
