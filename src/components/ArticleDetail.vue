<template>
    <div class="h-full w-full flex flex-col bg-white">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-semibold">文章详情</h2>
            <el-button @click="handleClose" type="default">
                <X class="w-5 h-5" />
                关闭
            </el-button>
        </div>
        
        <div class="flex flex-1 overflow-hidden">
            <!-- 左侧文章内容区域，占70%宽度 -->
            <div class="w-[70%] overflow-y-auto py-8 px-20 border-r ">
                <!-- 文章标题 -->
                <h1 class="text-3xl font-bold text-gray-900 mb-4">
                    {{ article.title }}
                </h1>
                
                <!-- 副标题 -->
                <h2 v-if="article.subTitle" class="text-xl text-gray-600 mb-6">
                    {{ article.subTitle }}
                </h2>
                
                <!-- 文章元信息 -->
                <div class="flex items-center gap-6 mb-8 pb-6 border-b">
                    <div class="flex items-center gap-2 text-gray-600">
                        <User class="w-4 h-4" />
                        <span>{{ article.authorName }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                        <Calendar class="w-4 h-4" />
                        <span>{{ formatDate(article.publishTime || article.updateTime) }}</span>
                    </div>
                    <div class="flex items-center gap-4 text-gray-500">
                        <span class="flex items-center gap-1">
                            <Eye class="w-4 h-4" />
                            {{ article.viewCount || 0 }}
                        </span>
                        <span class="flex items-center gap-1">
                            <Heart class="w-4 h-4" />
                            {{ article.likeCount || 0 }}
                        </span>
                        <span class="flex items-center gap-1">
                            <MessageSquare class="w-4 h-4" />
                            {{ article.commentCount || 0 }}
                        </span>
                    </div>
                </div>
                
                <!-- Markdown 内容 -->
                <div class="markdown-content">
                    <MdPreview :modelValue="article.content" />
                </div>
            </div>
            
            <!-- 右侧评论区，占30%宽度 -->
            <div v-if="article.id" class="w-[30%] flex flex-col bg-gray-50">
                <div class="p-4 border-b bg-white">
                    <h3 class="text-lg font-semibold">评论 ({{ article.commentCount || 0 }})</h3>
                </div>
                
                <!-- 评论列表 -->
                <div class="flex-1 overflow-y-auto p-4">
                    <div v-if="commentsLoading" class="flex justify-center py-8">
                        <Loader2 class="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                    
                    <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500">
                        暂无评论，快来抢沙发吧~
                    </div>
                    
                    <div v-else class="space-y-4">
                        <CommentNode
                            v-for="comment in comments"
                            :key="comment.id"
                            :comment="comment"
                            :is-root="true"
                            @reply="handleReply"
                            @delete="handleDeleteComment"
                        />
                    </div>
                </div>
                
                <!-- 评论输入区 - 固定在底部 -->
                <div class="p-4 border-t bg-white">
                    <el-input
                        v-model="commentContent"
                        type="textarea"
                        :rows="3"
                        :placeholder="replyTo ? `回复 @${replyTo.userName}` : '写下你的评论...'"
                        resize="none"
                    />
                    <div class="flex justify-between items-center mt-2">
                        <el-button v-if="replyTo" @click="cancelReply" size="small">
                            取消回复
                        </el-button>
                        <div class="flex-1"></div>
                        <el-button
                            type="primary"
                            @click="handleSubmitComment"
                            :disabled="!commentContent.trim()"
                        >
                            发表评论
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { X, Heart, User, Calendar, Eye, MessageSquare, Loader2 } from 'lucide-vue-next'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { articleAPI } from '@/api/article'
import { commentAPI } from '@/api/comment'
import CommentNode from './CommentNode.vue'

const props = defineProps({
    articleId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['close'])

const formatDate = (timeStr) => {
    if (!timeStr) return '-'
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const article = ref({
    id: '',
    articleId: '',
    title: '',
    subTitle: '',
    coverImage: '',
    content: '',
    authorName: '',
    publishTime: '',
    updateTime: '',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0
})

const commentContent = ref('')
const comments = ref([])
const commentsLoading = ref(false)
const replyTo = ref(null)

const loadArticle = async () => {
    try {
        const result = await articleAPI.getById(props.articleId)
        article.value = {
            ...result.data,
            id: String(result.data.id)
        }
        
        await incrementViewCount()
    } catch (error) {
        ElMessage.error('加载文章失败')
    }
}

const loadComments = async () => {
    commentsLoading.value = true
    try {
        const result = await commentAPI.getTree(props.articleId)
        comments.value = result.data || []
    } catch (error) {
        ElMessage.error('加载评论失败')
    } finally {
        commentsLoading.value = false
    }
}

const handleSubmitComment = async () => {
    if (!commentContent.value.trim()) {
        return
    }
    
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        await commentAPI.create({
            article_id: props.articleId,
            content: commentContent.value,
            user_id: userInfo.userId,
            user_name: userInfo.realName,
            parent_id: replyTo.value ? replyTo.value.id : null
        })
        ElMessage.success('评论发表成功')
        commentContent.value = ''
        replyTo.value = null
        loadComments()
    } catch (error) {
        ElMessage.error('评论发表失败')
    }
}

const handleReply = (comment) => {
    replyTo.value = comment
    commentContent.value = `@${comment.userName} `
}

const cancelReply = () => {
    replyTo.value = null
    commentContent.value = ''
}

const handleClose = () => {
    emit('close')
}

const handleDeleteComment = async (comment) => {
    try {
        await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await commentAPI.delete(comment.id)
        ElMessage.success('删除成功')
        loadComments()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

watch(() => props.articleId, (newId) => {
    if (newId) {
        loadArticle()
        loadComments()
    }
}, { immediate: true })

const incrementViewCount = async () => {
    try {
        await articleAPI.incrementView(props.articleId)
    } catch (error) {
    }
}

onMounted(() => {
})
</script>

<style scoped>
.markdown-content {
    line-height: 1.8;
    color: #333;
}

.markdown-content :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin: 1.5rem 0 1rem;
    color: #1a1a1a;
}

.markdown-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.25rem 0 0.75rem;
    color: #2a2a2a;
}

.markdown-content :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
    color: #3a3a3a;
}

.markdown-content :deep(p) {
    margin: 1rem 0;
    color: #4a4a4a;
}


.markdown-content :deep(code) {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
}

.markdown-content :deep(blockquote) {
    border-left: 4px solid #409eff;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #666;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
}

.markdown-content :deep(li) {
    margin: 0.5rem 0;
}

.markdown-content :deep(img) {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1rem 0;
}

.markdown-content :deep(a) {
    color: #409eff;
    text-decoration: none;
}

.markdown-content :deep(a:hover) {
    text-decoration: underline;
}

.markdown-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
    border: 1px solid #e4e7ed;
    padding: 0.75rem;
    text-align: left;
}

.markdown-content :deep(th) {
    background: #f5f7fa;
    font-weight: 600;
}

.space-y-4 > * + * {
    margin-top: 1rem;
}
</style>
