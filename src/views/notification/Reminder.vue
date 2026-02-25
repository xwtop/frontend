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
            <el-table :data="reminders" v-loading="loading">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="title" label="提醒标题" />
                <el-table-column prop="content" label="提醒内容" show-overflow-tooltip />
                <el-table-column label="提醒时间" width="180">
                    <template #default="{ row }">
                        {{ formatTime(row.remindTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="repeat" label="重复方式" width="120">
                    <template #default="{ row }">
                        <el-tag :type="getRepeatColor(row.repeat)">{{ getRepeatLabel(row.repeat) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'info'">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
                        <el-button :type="row.status === 1 ? 'warning' : 'success'" size="small" link @click="handleToggleStatus(row)">
                            {{ row.status === 1 ? '禁用' : '启用' }}
                        </el-button>
                        <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑提醒对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="600px"
        >
            <el-form :model="form" label-width="100px">
                <el-form-item label="提醒标题" required>
                    <el-input v-model="form.title" placeholder="请输入提醒标题" />
                </el-form-item>
                <el-form-item label="提醒内容" required>
                    <el-input v-model="form.content" type="textarea" :rows="3" placeholder="请输入提醒内容" />
                </el-form-item>
                <el-form-item label="提醒时间" required>
                    <el-date-picker
                        v-model="form.remindTime"
                        type="datetime"
                        placeholder="选择提醒时间"
                        style="width: 100%"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="重复方式" required>
                    <el-select v-model="form.repeat" style="width: 100%">
                        <el-option label="一次性" :value="0" />
                        <el-option label="每天" :value="1" />
                        <el-option label="每周" :value="2" />
                        <el-option label="每月" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" required>
                    <el-select v-model="form.targetType" style="width: 100%" @change="handleTargetTypeChange">
                        <el-option label="全员" :value="0" />
                        <el-option label="指定角色" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="目标角色" v-if="form.targetType === 1" required>
                    <el-select v-model="form.targetRole" style="width: 100%">
                        <el-option
                            v-for="role in roles"
                            :key="role.code"
                            :label="role.name"
                            :value="role.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { notificationReminderAPI } from '@/api/notificationReminder'
import { roleAPI } from '@/api/role'

const loading = ref(false)
const reminders = ref([])
const roles = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增提醒')
const form = ref({
    id: null,
    title: '',
    content: '',
    remindTime: '',
    repeat: 0,
    status: 1,
    targetType: 0,
    targetRole: null
})

const loadReminders = async () => {
    loading.value = true
    try {
        const res = await notificationReminderAPI.getList()
        reminders.value = res.data || []
    } catch (error) {
        ElMessage.error('加载提醒失败')
    } finally {
        loading.value = false
    }
}

const loadRoles = async () => {
    try {
        const res = await roleAPI.listAll()
        roles.value = res.data || []
    } catch (error) {
        ElMessage.error('加载角色列表失败')
    }
}

const getRepeatColor = (repeat) => {
    const colors = {
        0: 'primary',
        1: 'success',
        2: 'warning',
        3: 'danger'
    }
    return colors[repeat] || 'info'
}

const getRepeatLabel = (repeat) => {
    const labels = {
        0: '一次性',
        1: '每天',
        2: '每周',
        3: '每月'
    }
    return labels[repeat] || repeat
}

const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString
}

const handleAdd = () => {
    form.value = {
        id: null,
        title: '',
        content: '',
        remindTime: '',
        repeat: 0,
        status: 1,
        targetType: 0,
        targetRole: null
    }
    dialogTitle.value = '新增提醒'
    dialogVisible.value = true
}

const handleEdit = (row) => {
    form.value = {
        id: row.id,
        title: row.title,
        content: row.content,
        remindTime: row.remindTime,
        repeat: row.repeat,
        status: row.status,
        targetType: row.targetType,
        targetRole: row.targetRole
    }
    dialogTitle.value = '编辑提醒'
    dialogVisible.value = true
}

const handleTargetTypeChange = () => {
    if (form.value.targetType === 0) {
        form.value.targetRole = null
    }
}

const handleSubmit = async () => {
    try {
        if (form.value.id) {
            // 编辑提醒
            await notificationReminderAPI.update(form.value.id, form.value)
            ElMessage.success('编辑提醒成功')
        } else {
            // 新增提醒，移除id字段
            const newForm = { ...form.value }
            delete newForm.id
            await notificationReminderAPI.create(newForm)
            ElMessage.success('新增提醒成功')
        }
        dialogVisible.value = false
        loadReminders()
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

const handleToggleStatus = async (row) => {
    try {
        await notificationReminderAPI.toggleStatus(row.id)
        ElMessage.success(`提醒已${row.status === 1 ? '禁用' : '启用'}`)
        loadReminders()
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除这个提醒吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await notificationReminderAPI.delete(row.id)
        ElMessage.success('删除提醒成功')
        loadReminders()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

onMounted(() => {
    loadReminders()
    loadRoles()
})
</script>

<style scoped>
.notification-reminder-container {
    padding: 20px;
}

.toolbar {
    margin-bottom: 20px;
}
</style>
