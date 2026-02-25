<template>
    <div class="h-full w-full flex flex-col">
        <!-- 顶部栏，包含关闭按钮 -->
        <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-semibold">{{ articleId ? '编辑文章' : '新建文章' }}</h2>
            <el-button @click="handleClose" type="default" :icon="Close">
                关闭
            </el-button>
        </div>
        <div class="flex flex-1 gap-4 p-4">
            <!-- 左侧编辑器区域，占80%宽度 -->
            <div class="w-4/5">
                <div class="editor-wrapper h-full">
                    <MdEditor
                        v-model="form.content"
                        :preview="true"
                        :toolbars="toolbars"
                        @onUploadImg="handleUploadImage"
                        class="markdown-editor"
                    />
                </div>
            </div>
            <!-- 右侧配置面板，占20%宽度 -->
            <div class="w-1/5 bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col h-full">
                <h3 class="text-lg font-semibold mb-4">文章配置</h3>
                
                <div class="flex-1 flex flex-col gap-4">
                    <!-- 文章标题输入 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">文章标题 <span class="text-red-500">*</span></label>
                        <el-input
                            v-model="form.title"
                            placeholder="请输入文章标题"
                            required
                        />
                    </div>
                    
                    <!-- 副标题输入 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                        <el-input
                            v-model="form.subTitle"
                            placeholder="请输入文章副标题（可选）"
                        />
                    </div>
                    
                    <!-- 封面图片上传 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                        <el-upload
                            class="upload-demo"
                            action=""
                            :on-change="handleCoverUpload"
                            :auto-upload="false"
                            :limit="1"
                            :file-list="coverFileList"
                        >
                            <el-button type="primary">上传图片</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    请上传封面图片（可选）
                                </div>
                            </template>
                        </el-upload>
                        <div v-if="form.coverImage" class="mt-2">
                            <img :src="form.coverImage" class="w-full h-32 object-cover rounded" alt="封面图片">
                        </div>
                    </div>
                    
                    <!-- 分类选择 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <el-button @click="showCategoryDialog = true" type="primary" plain>
                        {{ selectedCategory ? selectedCategory.name : '选择分类' }}
                    </el-button>
                </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="flex gap-2 mt-6">
                    <el-button @click="handleSaveDraft" type="default" class="flex-1">
                        保存草稿
                    </el-button>
                    <el-button @click="handlePublish" type="primary" class="flex-1">
                        发布
                    </el-button>
                </div>
            </div>
        </div>
        
        <!-- 分类选择对话框 -->
        <el-dialog
            v-model="showCategoryDialog"
            title="选择分类"
            width="500px"
            :z-index="9999"
            append-to-body
        >
            <el-tree
                :data="categories"
                node-key="id"
                show-checkbox
                :props="categoryProps"
                @check-change="handleCategoryCheck"
                ref="categoryTree"
                :render-content="renderContent"
            />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showCategoryDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmCategorySelection">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { articleAPI } from '@/api/article'
import { uploadAPI } from '@/api/upload'
import { categoryAPI } from '@/api/category'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    articleId: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const showCategoryDialog = ref(false)
const categories = ref([])
const selectedCategory = ref(null)
const coverFileList = ref([])
const categoryTree = ref(null)

const categoryProps = {
    label: 'name',
    children: 'children'
}

const form = reactive({
    title: '',
    subTitle: '',
    coverImage: '',
    categoryId: '',
    content: ''
})

watch(() => props.modelValue, (newVal) => {
    visible.value = newVal
    if (newVal && props.articleId) {
        loadArticle()
    }
})

watch(() => props.articleId, (newVal) => {
    if (newVal && visible.value) {
        loadArticle()
    }
})

watch(visible, (newVal) => {
    emit('update:modelValue', newVal)
})

onMounted(() => {
    loadCategories()
    if (props.modelValue && props.articleId) {
        loadArticle()
    }
})

const toolbars = [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    '-',
    'revoke',
    'next',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
    'catalog',
]

const loadArticle = async () => {
    try {
        const result = await articleAPI.getById(props.articleId)
        const article = result.data
        form.title = article.title || ''
        form.subTitle = article.subTitle || ''
        form.coverImage = article.coverImage || ''
        form.categoryId = article.categoryId || ''
        form.content = article.content || ''
        
        // 加载分类信息
        if (form.categoryId) {
            try {
                const categoryResult = await categoryAPI.getById(form.categoryId)
                selectedCategory.value = categoryResult.data
            } catch (error) {
                console.error('加载分类信息失败', error)
            }
        }
    } catch (error) {
        ElMessage.error('加载文章失败')
    }
}

const loadCategories = async () => {
    try {
        const result = await categoryAPI.getTree()
        categories.value = result.data || []
    } catch (error) {
        ElMessage.error('加载分类失败')
    }
}

const handleUploadImage = async (files, callback) => {
    try {
        const result = await uploadAPI.uploadImage(files[0])
        callback([result.data.url])
    } catch (error) {
        ElMessage.error('图片上传失败')
    }
}

const handleCoverUpload = async (file) => {
    try {
        const result = await uploadAPI.uploadImage(file.raw)
        form.coverImage = result.data.url
        coverFileList.value = [{
            name: file.name,
            url: result.data.url
        }]
        ElMessage.success('封面图片上传成功')
    } catch (error) {
        ElMessage.error('封面图片上传失败')
    }
}

const renderContent = (h, { node, data, store }) => {
    // 检查是否是末级节点
    const isLeaf = !data.children || data.children.length === 0
    
    // 为非末级节点添加禁用样式
    if (!isLeaf) {
        return h('span', { 
            class: 'category-node-disabled',
            style: {
                cursor: 'not-allowed',
                opacity: '0.6'
            }
        }, [
            h('span', data.name)
        ])
    }
    
    // 末级节点正常显示
    return h('span', [
        h('span', data.name)
    ])
}

const handleCategoryCheck = (data, checked) => {
    // 检查是否是末级节点（没有子分类）
    const isLeaf = !data.children || data.children.length === 0
    
    if (checked) {
        if (!isLeaf) {
            // 如果不是末级节点，不允许选择
            ElMessage.warning('只能选择末级分类')
            // 取消选中
            if (categoryTree.value) {
                categoryTree.value.setChecked(data.id, false)
            }
            return
        }
        
        // 如果是末级节点，取消其他所有节点的选中状态
        if (categoryTree.value) {
            // 先获取所有已选中的节点
            const checkedNodes = categoryTree.value.getCheckedNodes()
            // 取消其他节点的选中状态
            checkedNodes.forEach(node => {
                if (node.id !== data.id) {
                    categoryTree.value.setChecked(node.id, false)
                }
            })
        }
        
        // 保存当前选中的节点
        selectedCategory.value = data
    } else {
        // 如果取消选中当前节点，清空选择
        if (selectedCategory.value && selectedCategory.value.id === data.id) {
            selectedCategory.value = null
        }
    }
}

const confirmCategorySelection = () => {
    const checkedNodes = categoryTree.value?.getCheckedNodes() || []
    if (checkedNodes.length > 0) {
        selectedCategory.value = checkedNodes[0]
        form.categoryId = selectedCategory.value.id
    }
    // 如果没有选择分类，保持原来的 selectedCategory.value 和 form.categoryId 不变
    showCategoryDialog.value = false
}

const handlePublish = async () => {
    if (!form.title.trim()) {
        ElMessage.warning('请输入文章标题')
        return
    }
    
    if (!form.content.trim()) {
        ElMessage.warning('请输入文章内容')
        return
    }
    
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const data = {
            title: form.title,
            sub_title: form.subTitle,
            content: form.content,
            status: 0,
            author_id: userInfo.userId,
            author_name: userInfo.realName
        }
        
        if (form.coverImage) {
            data.cover_image = form.coverImage
        }
        
        if (form.categoryId) {
            data.category_id = form.categoryId
        }
        
        let articleId = props.articleId
        
        if (props.articleId) {
            await articleAPI.update({ id: props.articleId, ...data })
        } else {
            const result = await articleAPI.create(data)
            articleId = result.data
        }
        
        if (articleId) {
            await articleAPI.publish(articleId)
            ElMessage.success('文章发布成功')
        }
        
        emit('success')
        handleClose()
    } catch (error) {
        ElMessage.error('文章发布失败')
    }
}

const handleSaveDraft = async () => {
    if (!form.title.trim()) {
        ElMessage.warning('请输入文章标题')
        return
    }
    
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const data = {
            title: form.title,
            sub_title: form.subTitle,
            content: form.content,
            status: 0,
            author_id: userInfo.userId,
            author_name: userInfo.realName
        }
        
        if (form.coverImage) {
            data.cover_image = form.coverImage
        }
        
        if (form.categoryId) {
            data.category_id = form.categoryId
        }
        
        if (props.articleId) {
            await articleAPI.update({ id: props.articleId, ...data })
            ElMessage.success('草稿保存成功')
        } else {
            await articleAPI.create(data)
            ElMessage.success('草稿保存成功')
        }
        
        emit('success')
        handleClose()
    } catch (error) {
        ElMessage.error('草稿保存失败')
    }
}

const handleClose = () => {
    // 重置表单
    form.title = ''
    form.subTitle = ''
    form.coverImage = ''
    form.categoryId = ''
    form.content = ''
    selectedCategory.value = null
    coverFileList.value = []
    visible.value = false
}
</script>

<style scoped>
.article-editor-dialog :deep(.el-dialog__body) {
    padding: 0;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
}

.editor-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
}

.markdown-editor {
    flex: 1;
    overflow: hidden;
    min-height: 0;
}

.markdown-editor :deep(.md-editor) {
    height: auto;
    border: none;
    flex: 1;
    min-height: 0;
}

.markdown-editor :deep(.md-editor-content) {
    height: auto;
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.markdown-editor :deep(.md-editor-toolbar) {
    background: #fafafa;
    border-bottom: 1px solid #e4e7ed;
    padding: 8px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.markdown-editor :deep(.md-editor-toolbar-item) {
    color: #606266;
    border-radius: 6px;
    padding: 6px;
    margin: 0 2px;
    transition: all 0.2s ease;
}

.markdown-editor :deep(.md-editor-toolbar-item:hover) {
    background: #e8f4ff;
    color: #409eff;
}

.markdown-editor :deep(.md-editor-toolbar-item.md-editor-toolbar-active) {
    background: #409eff;
    color: #fff;
}

.markdown-editor :deep(.md-editor-divider) {
    background: #dcdfe6;
    margin: 0 8px;
    height: 20px;
}

.markdown-editor :deep(.md-editor-menu) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e4e7ed;
}

.markdown-editor :deep(.md-editor-menu-item) {
    padding: 8px 16px;
    transition: all 0.2s ease;
}

.markdown-editor :deep(.md-editor-menu-item:hover) {
    background: #f5f7fa;
    color: #409eff;
}

.markdown-editor :deep(.md-editor-table-shape) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e4e7ed;
}

.markdown-editor :deep(.md-editor-table-shape-col-default) {
    border-radius: 2px;
    transition: all 0.2s ease;
}

.markdown-editor :deep(.md-editor-table-shape-col-default:hover) {
    background: #409eff;
}
</style>