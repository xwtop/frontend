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
                <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
                <el-table-column label="操作" width="240" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)" link>
                            编辑
                        </el-button>
                        <el-button type="success" size="small" :icon="Key" @click="handleAssignPermission(row)" link>
                            分配权限
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
            width="600px"
            @close="handleDialogClose"
        >
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="显示顺序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" placeholder="请输入显示顺序" style="width: 100%" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
            v-model="permissionDialogVisible"
            title="分配权限"
            width="800px"
            @close="handlePermissionDialogClose"
        >
            <el-transfer
                v-model="selectedPermissionIds"
                :data="allPermissions"
                :titles="['可选权限', '已选权限']"
                :button-texts="['移除', '添加']"
                filterable
                filter-placeholder="搜索权限"
                :props="{ key: 'id', label: 'name' }"
            />
            <template #footer>
                <el-button @click="permissionDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAssignPermissionSubmit" :loading="assignLoading">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, Key } from '@element-plus/icons-vue'
import { roleAPI } from '../../api/role'
import { permissionAPI } from '../../api/permission'

const loading = ref(false)
const submitLoading = ref(false)
const assignLoading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
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
    status: 1
})

const rules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])

const currentRoleId = ref(null)
const allPermissions = ref([])
const selectedPermissionIds = ref([])

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
        ElMessage.error(error.message || '获取角色列表失败')
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

const handleAdd = () => {
    dialogTitle.value = '新增角色'
    isEdit.value = false
    Object.assign(form, {
        id: null,
        name: '',
        code: '',
        remark: '',
        sort: 0,
        status: 1
    })
    dialogVisible.value = true
}

const handleEdit = (row) => {
    dialogTitle.value = '编辑角色'
    isEdit.value = true
    Object.assign(form, {
        id: row.id,
        name: row.name,
        code: row.code,
        remark: row.remark,
        sort: row.sort,
        status: row.status
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
            ElMessage.error(error.message || '删除失败')
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
        ElMessage.error(error.message || '操作失败')
    } finally {
        submitLoading.value = false
    }
}

const handleDialogClose = () => {
    formRef.value?.resetFields()
}

const handleAssignPermission = async (row) => {
    currentRoleId.value = row.id
    assignLoading.value = true
    try {
        const [permissionsRes, rolePermissionsRes] = await Promise.all([
            permissionAPI.listAll(),
            roleAPI.getPermissions(row.id)
        ])

        if (permissionsRes.status === 200) {
            allPermissions.value = permissionsRes.data.map(perm => ({
                id: perm.id,
                name: perm.name,
                code: perm.code,
                type: perm.type,
                disabled: perm.status === 0
            }))
        } else {
            ElMessage.error('获取权限列表失败')
            return
        }

        if (rolePermissionsRes.status === 200) {
            selectedPermissionIds.value = rolePermissionsRes.data.map(perm => perm.id)
        } else {
            ElMessage.error('获取角色权限失败')
            return
        }

        permissionDialogVisible.value = true
    } catch (error) {
        ElMessage.error(error.message || '获取权限数据失败')
    } finally {
        assignLoading.value = false
    }
}

const handleAssignPermissionSubmit = async () => {
    assignLoading.value = true
    try {
        const response = await roleAPI.assignPermissions(currentRoleId.value, selectedPermissionIds.value)
        if (response.status === 200) {
            ElMessage.success('权限分配成功')
            permissionDialogVisible.value = false
        } else {
            ElMessage.error(response.statusText || '权限分配失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '权限分配失败')
    } finally {
        assignLoading.value = false
    }
}

const handlePermissionDialogClose = () => {
    currentRoleId.value = null
    allPermissions.value = []
    selectedPermissionIds.value = []
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
