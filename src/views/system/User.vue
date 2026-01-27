<template>
    <div class="user-management">
        <el-card>
            <div class="flex items-center justify-center mb-4">
                <el-form :inline="true" :model="queryForm" class="search-form">
                    <el-form-item label="学号">
                        <el-input v-model="queryForm.username" placeholder="请输入学号" clearable style="width: 150px" />
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="queryForm.real_name" placeholder="请输入真实姓名" clearable style="width: 150px" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
                            <el-option label="启用" :value="1" />
                            <el-option label="禁用" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">
                        批量删除
                    </el-button>
                </div>
            </div>

            <el-table :data="tableData" v-loading="loading" class="modern-table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="username" label="学号" min-width="120" align="center" />
                <el-table-column prop="realName" label="真实姓名" min-width="120" align="center" />
                <el-table-column prop="email" label="邮箱" min-width="250" align="center" />
                <el-table-column prop="phone" label="手机号" min-width="130" align="center" />
                <el-table-column label="性别" width="80" align="center">
                    <template #default="{ row }">
                        <span>{{ getGenderText(row.gender) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="birthday" label="生日" width="120" align="center" />
                <el-table-column prop="introduction" label="个人简介" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column label="角色" min-width="200" align="center">
                    <template #default="{ row }">
                        <el-tag v-for="role in row.roles" :key="role.id" class="mr-1" size="small">
                            {{ role.name }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
                <el-table-column label="操作" width="240" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)" link>
                            编辑
                        </el-button>
                        <el-button type="warning" size="small" :icon="Key" @click="handleResetPassword(row)" link>
                            修改密码
                        </el-button>
                        <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)" link>
                            删除
                        </el-button>
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

        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="700px"
            @close="handleDialogClose"
        >
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="学号" prop="username">
                            <el-input v-model="form.username" placeholder="请输入学号" :disabled="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="real_name">
                            <el-input v-model="form.real_name" placeholder="请输入真实姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="form.gender">
                                <el-radio :value="0">未知</el-radio>
                                <el-radio :value="1">男</el-radio>
                                <el-radio :value="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生日" prop="birthday">
                            <el-date-picker
                                v-model="form.birthday"
                                type="date"
                                placeholder="请选择生日"
                                style="width: 100%"
                                value-format="YYYY-MM-DD"
                                format="YYYY-MM-DD"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="个人简介" prop="introduction">
                    <el-input
                        v-model="form.introduction"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入个人简介"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!isEdit">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="角色" prop="role_ids">
                    <el-select v-model="form.role_ids" multiple placeholder="请选择角色" style="width: 100%">
                        <el-option
                            v-for="role in roleList"
                            :key="role.id"
                            :label="role.name"
                            :value="role.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="passwordDialogVisible"
            title="修改密码"
            width="500px"
            @close="handlePasswordDialogClose"
        >
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
                <el-form-item label="用户">
                    <el-input v-model="currentUser.realName" disabled />
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="passwordForm.password" type="password" placeholder="请输入新密码" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="passwordDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleResetPasswordSubmit" :loading="submitLoading">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, Key } from '@element-plus/icons-vue'
import { userAPI } from '../../api/user'
import { roleAPI } from '../../api/role'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)
const passwordFormRef = ref(null)

const queryForm = reactive({
    username: '',
    real_name: '',
    status: null,
    page: 1,
    page_size: 10
})

const form = reactive({
    id: null,
    username: '',
    real_name: '',
    email: '',
    phone: '',
    password: '',
    gender: 0,
    birthday: '',
    introduction: '',
    role_ids: [],
    status: 1
})

const passwordForm = reactive({
    password: '',
    confirmPassword: ''
})

const currentUser = ref({})

const rules = {
    username: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const passwordRules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const tableData = ref([])
const total = ref(0)
const roleList = ref([])
const selectedRows = ref([])

const getGenderText = (gender) => {
    const map = { 0: '未知', 1: '男', 2: '女' }
    return map[gender] || '未知'
}

const handleSearch = async () => {
    loading.value = true
    try {
        const response = await userAPI.getList(queryForm)
        if (response.status === 200) {
            tableData.value = response.data.list
            total.value = response.data.total
        } else {
            ElMessage.error(response.statusText || '获取用户列表失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '获取用户列表失败')
    } finally {
        loading.value = false
    }
}

const handleReset = () => {
    queryForm.username = ''
    queryForm.real_name = ''
    queryForm.status = null
    queryForm.page = 1
    handleSearch()
}

const handleAdd = async () => {
    dialogTitle.value = '新增用户'
    isEdit.value = false
    await getRoleList()
    Object.assign(form, {
        id: null,
        username: '',
        real_name: '',
        email: '',
        phone: '',
        password: '',
        gender: 0,
        birthday: '',
        introduction: '',
        role_ids: [],
        status: 1
    })
    dialogVisible.value = true
}

const handleEdit = async (row) => {
    dialogTitle.value = '编辑用户'
    isEdit.value = true
    await getRoleList()
    Object.assign(form, {
        id: row.id,
        username: row.username,
        real_name: row.realName,
        email: row.email,
        phone: row.phone,
        password: '',
        gender: row.gender,
        birthday: row.birthday,
        introduction: row.introduction,
        role_ids: row.roles.map(r => r.id),
        status: row.status
    })
    dialogVisible.value = true
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const response = await userAPI.delete(row.id)
            if (response.status === 200) {
                ElMessage.success('删除成功')
                handleSearch()
            } else {
                ElMessage.error(response.statusText || '删除失败')
            }
        } catch (error) {
            ElMessage.error(error.message || '删除失败')
        }
    }).catch(() => {})
}

const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}

const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要删除的用户')
        return
    }
    
    ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const ids = selectedRows.value.map(row => row.id).join(',')
            const response = await userAPI.delete(ids)
            if (response.status === 200) {
                ElMessage.success('批量删除成功')
                selectedRows.value = []
                handleSearch()
            } else {
                ElMessage.error(response.statusText || '批量删除失败')
            }
        } catch (error) {
            ElMessage.error(error.message || '批量删除失败')
        }
    }).catch(() => {})
}

const handleSubmit = async () => {
    await formRef.value.validate()
    submitLoading.value = true
    try {
        let response
        if (isEdit.value) {
            response = await userAPI.update(form)
        } else {
            response = await userAPI.create(form)
        }
        if (response.status === 200) {
            ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
            dialogVisible.value = false
            handleSearch()
        } else {
            ElMessage.error(response.statusText || '操作失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '操作失败')
    } finally {
        submitLoading.value = false
    }
}

const handleDialogClose = () => {
    formRef.value?.resetFields()
}

const handleResetPassword = (row) => {
    currentUser.value = row
    passwordForm.password = ''
    passwordForm.confirmPassword = ''
    passwordDialogVisible.value = true
}

const handleResetPasswordSubmit = async () => {
    await passwordFormRef.value.validate()
    submitLoading.value = true
    try {
        const response = await userAPI.resetPassword(currentUser.value.id, passwordForm.password)
        if (response.status === 200) {
            ElMessage.success('修改密码成功')
            passwordDialogVisible.value = false
        } else {
            ElMessage.error(response.statusText || '修改密码失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '修改密码失败')
    } finally {
        submitLoading.value = false
    }
}

const handlePasswordDialogClose = () => {
    passwordFormRef.value?.resetFields()
}

const getRoleList = async () => {
    try {
        const response = await roleAPI.listAll()
        if (response.status === 200) {
            roleList.value = response.data
        }
    } catch (error) {
        console.error('获取角色列表失败', error)
    }
}

onMounted(() => {
    handleSearch()
})
</script>

<style scoped>
.el-tag {
    margin-right: 4px;
}

.search-form {
    margin: 0;
}

.search-form :deep(.el-form-item) {
    margin-bottom: 0;
}

.modern-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.modern-table :deep(.el-table__header th.el-table__cell) {
    background: #f5f7fa;
    color: #303133;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 2px solid #e4e7ed;
}

.modern-table :deep(.el-table__body tr) {
    transition: all 0.2s ease;
}

.modern-table :deep(.el-table__body tr:hover > td) {
    background-color: #f5f7fa;
}

.modern-table :deep(.el-table__body td) {
    border-bottom: 1px solid #ebeef5;
    padding: 12px 0;
    font-size: 14px;
}

.modern-table :deep(.el-table__body tr:last-child td) {
    border-bottom: none;
}

.modern-table :deep(.el-button--small.is-link) {
    padding: 0 8px;
    margin: 0 2px;
}

.modern-table :deep(.el-checkbox__inner) {
    border-radius: 4px;
}

.modern-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #409eff;
    border-color: #409eff;
}

.modern-table :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #409eff;
    border-color: #409eff;
}
</style>
