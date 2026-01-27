<template>
    <div class="feedback-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>意见反馈</span>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="提交反馈" name="submit">
                    <el-form :model="form" label-width="100px">
                        <el-form-item label="反馈类型">
                            <el-select v-model="form.type">
                                <el-option label="功能建议" value="suggestion" />
                                <el-option label="问题反馈" value="bug" />
                                <el-option label="其他" value="other" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="反馈标题">
                            <el-input v-model="form.title" placeholder="请输入反馈标题" />
                        </el-form-item>
                        <el-form-item label="反馈内容">
                            <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请详细描述您的反馈" />
                        </el-form-item>
                        <el-form-item label="联系方式">
                            <el-input v-model="form.contact" placeholder="请输入您的联系方式（可选）" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit">提交反馈</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="反馈处理" name="handle">
                    <el-table :data="feedbackList">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="title" label="反馈标题" />
                        <el-table-column prop="type" label="类型" width="120">
                            <template #default="{ row }">
                                <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template #default="{ row }">
                                <el-tag :type="getStatusColor(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="submitTime" label="提交时间" width="180" />
                        <el-table-column label="操作" width="150" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" link>查看详情</el-button>
                                <el-button v-if="row.status === 'pending'" type="danger" size="small" link>
                                    撤销
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('submit')

const form = reactive({
    type: 'suggestion',
    title: '',
    content: '',
    contact: ''
})

const feedbackList = ref([
    { title: '建议增加夜间模式', type: 'suggestion', status: 'processing', submitTime: '2026-01-25 10:30:00' },
    { title: '登录页面加载缓慢', type: 'bug', status: 'resolved', submitTime: '2026-01-20 15:20:00' },
    { title: '希望能增加导出功能', type: 'suggestion', status: 'pending', submitTime: '2026-01-15 09:10:00' }
])

const getTypeColor = (type) => {
    const colors = {
        suggestion: 'primary',
        bug: 'danger',
        other: 'info'
    }
    return colors[type] || 'info'
}

const getTypeLabel = (type) => {
    const labels = {
        suggestion: '功能建议',
        bug: '问题反馈',
        other: '其他'
    }
    return labels[type] || type
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'info',
        processing: 'warning',
        resolved: 'success',
        rejected: 'danger'
    }
    return colors[status] || 'info'
}

const getStatusLabel = (status) => {
    const labels = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        rejected: '已驳回'
    }
    return labels[status] || status
}

const handleSubmit = () => {
    ElMessage.success('反馈提交成功')
    handleReset()
}

const handleReset = () => {
    form.type = 'suggestion'
    form.title = ''
    form.content = ''
    form.contact = ''
}
</script>

<style scoped>
.feedback-container {
    padding: 20px;
}
</style>
