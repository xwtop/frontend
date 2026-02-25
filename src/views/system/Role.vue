<template>
    <div class="role-management">
        <el-card>
            <div class="flex items-center justify-center mb-4">
                <el-form :inline="true" :model="queryForm" class="search-form">
                    <el-form-item label="角色名称">
                        <el-input v-model="queryForm.name" placeholder="请输入角色名称" clearable style="width: 150px" />
                    </el-form-item>
                    <el-form-item label="角色编码">
                        <el-input v-model="queryForm.code" placeholder="请输入角色编码" clearable style="width: 150px" />
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
                    <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
                    <el-button type="danger" :icon="Delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">
                        批量删除
                    </el-button>
                </div>
            </div>

            <el-table :data="tableData" v-loading="loading" class="modern-table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="name" label="角色名称" min-width="150" align="center" />
                <el-table-column prop="code" label="角色编码" min-width="150" align="center" />
                <el-table-column prop="remark" label="备注" min-width="200" align="center" />
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="角色权限" min-width="300" align="center">
                    <template #default="{ row }">
                        <div v-if="row.permissions && row.permissions.length > 0" class="permission-tags">
                            <el-tag v-for="perm in row.permissions" :key="perm.id" size="small" class="permission-tag">
                                {{ perm.name }}
                            </el-tag>
                        </div>
                        <span v-else class="text-gray-400">暂无权限</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)" link>
                            编辑
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
            width="800px"
            @close="handleDialogClose"
        >
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入角色名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色编码" prop="code">
                            <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="isEdit" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="显示顺序" prop="sort">
                            <el-input-number v-model="form.sort" :min="0" placeholder="请输入显示顺序" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :value="1">启用</el-radio>
                                <el-radio :value="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="权限" prop="permission_ids">
                    <el-select v-model="form.permission_ids" multiple placeholder="请选择权限" style="width: 100%">
                        <el-option
                            v-for="perm in permissionList"
                            :key="perm.id"
                            :label="perm.name"
                            :value="perm.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { roleAPI } from '../../api/role'
import { permissionAPI } from '../../api/permission'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)

const queryForm = reactive({
    name: '',
    code: '',
    status: null,
    page: 1,
    page_size: 10
})

const form = reactive({
    id: null,
    name: '',
    code: '',
    remark: '',
    sort: 0,
    status: 1,
    permission_ids: []
})

const rules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const permissionList = ref([])

const handleSearch = async () => {
    loading.value = true
    try {
        const response = await roleAPI.getList(queryForm)
        if (response.status === 200) {
            tableData.value = response.data.list
            total.value = response.data.total
        } else {
            ElMessage.error(response.statusText || '获取角色列表失败')
        }
    } catch (error) {
        const errorMessage = error.response?.data?.statusText || error.response?.data?.message || error.message || '获取角色列表失败'
        ElMessage.error(errorMessage)
    } finally {
        loading.value = false
    }
}

const handleReset = () => {
    queryForm.name = ''
    queryForm.code = ''
    queryForm.status = null
    queryForm.page = 1
    handleSearch()
}

const handleAdd = async () => {
    dialogTitle.value = '新增角色'
    isEdit.value = false
    await getPermissionList()
    Object.assign(form, {
        id: null,
        name: '',
        code: '',
        remark: '',
        sort: 0,
        status: 1,
        permission_ids: []
    })
    dialogVisible.value = true
}

const handleEdit = async (row) => {
    dialogTitle.value = '编辑角色'
    isEdit.value = true
    await getPermissionList()
    Object.assign(form, {
        id: row.id,
        name: row.name,
        code: row.code,
        remark: row.remark,
        sort: row.sort,
        status: row.status,
        permission_ids: row.permissions ? row.permissions.map(p => p.id) : []
    })
    dialogVisible.value = true
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const response = await roleAPI.delete(row.id)
            if (response.status === 200) {
                ElMessage.success('删除成功')
                handleSearch()
            } else {
                ElMessage.error(response.statusText || '删除失败')
            }
        } catch (error) {
            const errorMessage = error.response?.data?.statusText || error.response?.data?.message || error.message || '删除失败'
            ElMessage.error(errorMessage)
        }
    }).catch(() => {})
}

const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}

const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要删除的角色')
        return
    }
    
    ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const ids = selectedRows.value.map(row => row.id).join(',')
            const response = await roleAPI.delete(ids)
            if (response.status === 200) {
                ElMessage.success('批量删除成功')
                selectedRows.value = []
                handleSearch()
            } else {
                ElMessage.error(response.statusText || '批量删除失败')
            }
        } catch (error) {
            const errorMessage = error.response?.data?.statusText || error.response?.data?.message || error.message || '批量删除失败'
            ElMessage.error(errorMessage)
        }
    }).catch(() => {})
}

const handleSubmit = async () => {
    await formRef.value.validate()
    submitLoading.value = true
    try {
        let response
        if (isEdit.value) {
            response = await roleAPI.update(form)
        } else {
            response = await roleAPI.create(form)
        }
        if (response.status === 200) {
            ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
            dialogVisible.value = false
            handleSearch()
        } else {
            ElMessage.error(response.statusText || '操作失败')
        }
    } catch (error) {
        const errorMessage = error.response?.data?.statusText || error.response?.data?.message || error.message || '操作失败'
        ElMessage.error(errorMessage)
    } finally {
        submitLoading.value = false
    }
}

const handleDialogClose = () => {
    formRef.value?.resetFields()
}

const getPermissionList = async () => {
    try {
        const response = await permissionAPI.listAll()
        if (response.status === 200) {
            permissionList.value = response.data
        }
    } catch (error) {
        console.error('获取权限列表失败', error)
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

.permission-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
}

.permission-tag {
    margin: 0;
    font-size: 12px;
}

.text-gray-400 {
    color: #9ca3af;
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
