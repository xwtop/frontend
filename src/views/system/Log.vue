<template>
    <div class="log-audit-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>日志审计</span>
                </div>
            </template>
            <el-form :inline="true" :model="queryForm" class="search-form">
                <el-form-item label="操作类型">
                    <el-select v-model="queryForm.type" placeholder="请选择" clearable>
                        <el-option label="登录" value="login" />
                        <el-option label="登出" value="logout" />
                        <el-option label="新增" value="create" />
                        <el-option label="修改" value="update" />
                        <el-option label="删除" value="delete" />
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="queryForm.operator" placeholder="请输入操作人" clearable />
                </el-form-item>
                <el-form-item label="时间范围">
                    <el-date-picker
                        v-model="queryForm.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                    <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="logList">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="operator" label="操作人" width="120" />
                <el-table-column prop="type" label="操作类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getTypeColor(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="module" label="操作模块" width="120" />
                <el-table-column prop="description" label="操作描述" show-overflow-tooltip />
                <el-table-column prop="ip" label="IP地址" width="140" />
                <el-table-column prop="createTime" label="操作时间" width="180" />
                <el-table-column label="操作" width="100" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link>查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-model:current-page="queryForm.page"
                v-model:page-size="queryForm.page_size"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSearch"
                @current-change="handleSearch"
                class="mt-4 justify-end"
            />
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const queryForm = reactive({
    type: '',
    operator: '',
    dateRange: [],
    page: 1,
    page_size: 10
})

const total = ref(0)
const logList = ref([
    { operator: 'admin', type: 'login', module: '系统', description: '用户登录系统', ip: '192.168.1.100', createTime: '2026-01-27 10:30:00' },
    { operator: 'admin', type: 'create', module: '用户管理', description: '新增用户：张三', ip: '192.168.1.100', createTime: '2026-01-27 10:35:00' },
    { operator: 'admin', type: 'update', module: '角色管理', description: '修改角色：管理员', ip: '192.168.1.100', createTime: '2026-01-27 10:40:00' },
    { operator: 'zhangsan', type: 'login', module: '系统', description: '用户登录系统', ip: '192.168.1.101', createTime: '2026-01-27 11:00:00' },
    { operator: 'zhangsan', type: 'delete', module: '公告管理', description: '删除公告：系统维护通知', ip: '192.168.1.101', createTime: '2026-01-27 11:05:00' }
])

total.value = 50

const getTypeColor = (type) => {
    const colors = {
        login: 'success',
        logout: 'info',
        create: 'primary',
        update: 'warning',
        delete: 'danger'
    }
    return colors[type] || 'info'
}

const getTypeLabel = (type) => {
    const labels = {
        login: '登录',
        logout: '登出',
        create: '新增',
        update: '修改',
        delete: '删除'
    }
    return labels[type] || type
}

const handleSearch = () => {
    console.log('搜索日志', queryForm)
}

const handleReset = () => {
    queryForm.type = ''
    queryForm.operator = ''
    queryForm.dateRange = []
    queryForm.page = 1
    handleSearch()
}
</script>

<style scoped>
.log-audit-container {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
}

.search-form :deep(.el-form-item) {
    margin-bottom: 0;
}
</style>
