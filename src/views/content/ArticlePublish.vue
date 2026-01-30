<template>
    <div class="h-full w-full flex flex-col">
        <div class="editor-wrapper">
            <MdEditor
                v-model="form.content"
                :preview="true"
                :toolbars="toolbars"
                @onUploadImg="handleUploadImage"
                class="markdown-editor"
            >
                <template #defToolbars>
                    <NormalToolbar title="存草稿" @click="handleSaveDraft">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                    </NormalToolbar>
                    <NormalToolbar title="发布" @click="handlePublish">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </NormalToolbar>
                </template>
            </MdEditor>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { MdEditor, NormalToolbar } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { articleAPI } from '@/api/article'
import { uploadAPI } from '@/api/upload'

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
    0,
    1
]

const form = reactive({
    content: ''
})

const publishing = ref(false)
const saving = ref(false)

const handleUploadImage = async (files, callback) => {
    try {
        const result = await uploadAPI.uploadImage(files[0])
        callback([result.data.url])
    } catch (error) {
        ElMessage.error('图片上传失败')
    }
}

const handlePublish = async () => {
    if (!form.content.trim()) {
        ElMessage.warning('请输入文章内容')
        return
    }
    
    publishing.value = true
    try {
        const data = {
            content: form.content
        }
        await articleAPI.create(data)
        ElMessage.success('文章发布成功')
        handleReset()
    } catch (error) {
        ElMessage.error('文章发布失败')
    } finally {
        publishing.value = false
    }
}

const handleSaveDraft = async () => {
    saving.value = true
    try {
        const data = {
            content: form.content
        }
        await articleAPI.create(data)
        ElMessage.success('草稿保存成功')
    } catch (error) {
        ElMessage.error('草稿保存失败')
    } finally {
        saving.value = false
    }
}

const handleReset = () => {
    form.content = ''
}
</script>

<style scoped>
.editor-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.markdown-editor {
    flex: 1;
    overflow: hidden;
    height: 100%;
}

.markdown-editor :deep(.md-editor) {
    height: 100%;
    border: none;
}

.markdown-editor :deep(.md-editor-content) {
    height: calc(100% - 40px);
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

.markdown-editor :deep(.md-editor-toolbar-item svg) {
    width: 18px;
    height: 18px;
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

.markdown-editor :deep(.custom-toolbar-buttons) {
    display: flex;
    gap: 8px;
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid #dcdfe6;
}

.markdown-editor :deep(.custom-toolbar-buttons .el-button) {
    height: 32px;
    padding: 0 16px;
    font-size: 13px;
}

.markdown-editor :deep(.custom-toolbar-buttons .el-button--primary) {
    background: #409eff;
    border-color: #409eff;
}

.markdown-editor :deep(.custom-toolbar-buttons .el-button--primary:hover) {
    background: #66b1ff;
    border-color: #66b1ff;
}

.markdown-editor :deep(.custom-toolbar-buttons .el-button:not(.el-button--primary):hover) {
    color: #409eff;
    border-color: #c6e2ff;
    background: #ecf5ff;
}
</style>
