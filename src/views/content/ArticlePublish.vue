<template>
    <div class="article-publish-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>发布文章</span>
                </div>
            </template>
            <el-form :model="form" label-width="100px">
                <el-form-item label="文章标题">
                    <el-input v-model="form.title" placeholder="请输入文章标题" />
                </el-form-item>
                <el-form-item label="文章类型">
                    <el-select v-model="form.type">
                        <el-option label="公告" value="announcement" />
                        <el-option label="资讯" value="information" />
                        <el-option label="新闻" value="news" />
                        <el-option label="通知" value="notice" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model="form.categoryId" placeholder="请选择分类">
                        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章内容">
                    <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入文章内容" />
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-switch v-model="form.isTop" />
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-switch v-model="form.isPublished" />
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-date-picker
                        v-model="form.expireDate"
                        type="datetime"
                        placeholder="选择过期时间（可选）"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlePublish">发布文章</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
    title: '',
    type: 'announcement',
    categoryId: '',
    content: '',
    isTop: false,
    isPublished: true,
    expireDate: ''
})

const categories = ref([
    { id: 1, name: '教务通知' },
    { id: 2, name: '学工动态' },
    { id: 3, name: '校园新闻' },
    { id: 4, name: '学术讲座' },
    { id: 5, name: '活动预告' }
])

const handlePublish = () => {
    if (!form.title.trim()) {
        ElMessage.warning('请输入文章标题')
        return
    }
    if (!form.content.trim()) {
        ElMessage.warning('请输入文章内容')
        return
    }
    ElMessage.success('文章发布成功')
    handleReset()
}

const handleReset = () => {
    form.title = ''
    form.type = 'announcement'
    form.categoryId = ''
    form.content = ''
    form.isTop = false
    form.isPublished = true
    form.expireDate = ''
}
</script>

<style scoped>
.article-publish-container {
    padding: 20px;
}
</style>
