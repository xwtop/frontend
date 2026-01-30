<template>
    <div class="category-manage-container">
        <el-card>
            <template #header>
                <div class="flex justify-between items-center">
                    <span>分类管理</span>
                                <div class="">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增分类</el-button>
            </div>
                </div>
            </template>

            <el-table :data="categories" row-key="id" :tree-props="{ children: 'children' }" default-expand-all v-loading="loading">
                <el-table-column prop="name" label="分类名称" />
                <el-table-column prop="code" label="分类编码" width="300" />
                <el-table-column prop="sort" label="排序" width="200" align="center" />
                <el-table-column prop="status" label="状态" width="200" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="large" link @click="handleAddChild(row)">新增子分类</el-button>
                        <el-button type="primary" size="large" link @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="large" link @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="500px"
            @close="handleDialogClose"
        >
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="父分类" prop="parentId">
                    <el-tree-select
                        v-model="form.parentId"
                        :data="categoryOptions"
                        :props="{ label: 'name', value: 'id' }"
                        placeholder="请选择父分类（不选则为顶级分类）"
                        clearable
                        check-strictly
                    />
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="分类编码" prop="code">
                    <el-input v-model="form.code" placeholder="请输入分类编码" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" :max="9999" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryAPI } from '@/api/category'

const categories = ref([])
const categoryOptions = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '新增分类')
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = ref({
    id: null,
    parentId: null,
    name: '',
    code: '',
    sort: 0,
    status: 1,
    remark: ''
})

const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入分类编码', trigger: 'blur' }
    ]
}

const fetchCategoryTree = async () => {
    loading.value = true
    try {
        const res = await categoryAPI.getTree()
        if (res.status === 200) {
            categories.value = res.data
            categoryOptions.value = res.data
        } else {
            ElMessage.error(res.statusText || '获取分类列表失败')
        }
    } catch (error) {
        ElMessage.error('获取分类列表失败')
    } finally {
        loading.value = false
    }
}

const handleAdd = () => {
    isEdit.value = false
    form.value = {
        id: null,
        parentId: null,
        name: '',
        code: '',
        sort: 0,
        status: 1,
        remark: ''
    }
    dialogVisible.value = true
}

const handleAddChild = (row) => {
    isEdit.value = false
    form.value = {
        id: null,
        parentId: row.id,
        name: '',
        code: '',
        sort: 0,
        status: 1,
        remark: ''
    }
    dialogVisible.value = true
}

const handleEdit = async (row) => {
    isEdit.value = true
    try {
        const res = await categoryAPI.getById(row.id)
        if (res.status === 200) {
            form.value = {
                id: res.data.id,
                parentId: res.data.parentId,
                name: res.data.name,
                code: res.data.code,
                sort: res.data.sort,
                status: res.data.status,
                remark: res.data.remark
            }
            dialogVisible.value = true
        } else {
            ElMessage.error(res.statusText || '获取分类详情失败')
        }
    } catch (error) {
        ElMessage.error('获取分类详情失败')
    }
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const res = await categoryAPI.delete(row.id)
            if (res.status === 200) {
                ElMessage.success('删除成功')
                fetchCategoryTree()
            } else {
                ElMessage.error(res.statusText || '删除失败')
            }
        } catch (error) {
            ElMessage.error('删除失败')
        }
    }).catch(() => {})
}

const handleSubmit = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        submitting.value = true
        try {
            let res
            if (isEdit.value) {
                res = await categoryAPI.update(form.value)
            } else {
                res = await categoryAPI.create(form.value)
            }
            
            if (res.status === 200) {
                ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
                dialogVisible.value = false
                fetchCategoryTree()
            } else {
                ElMessage.error(res.statusText || (isEdit.value ? '更新失败' : '新增失败'))
            }
        } catch (error) {
            ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
        } finally {
            submitting.value = false
        }
    })
}

const handleDialogClose = () => {
    formRef.value?.resetFields()
}

onMounted(() => {
    fetchCategoryTree()
})
</script>

<style scoped>

</style>
