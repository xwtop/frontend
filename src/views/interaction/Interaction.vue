<template>
    <div class="interaction-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>内容互动</span>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="点赞/点踩" name="likes">
                    <el-table :data="likedContent">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="title" label="标题" />
                        <el-table-column prop="type" label="类型" width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.type === 'like' ? 'success' : 'danger'">
                                    {{ row.type === 'like' ? '点赞' : '点踩' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="author" label="作者" width="120" />
                        <el-table-column prop="actionTime" label="互动时间" width="180" />
                        <el-table-column label="操作" width="100" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" link>查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="评论管理" name="comments">
                    <el-table :data="comments">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="contentTitle" label="内容标题" />
                        <el-table-column prop="comment" label="评论内容" show-overflow-tooltip />
                        <el-table-column prop="commentTime" label="评论时间" width="180" />
                        <el-table-column label="操作" width="150" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" link>编辑</el-button>
                                <el-button type="danger" size="small" link>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('likes')

const likedContent = ref([
    { title: '校园智慧平台使用指南', type: 'like', author: '管理员', actionTime: '2026-01-25 10:30:00' },
    { title: '2026年春季学期选课通知', type: 'like', author: '教务处', actionTime: '2026-01-20 15:20:00' },
    { title: '图书馆开放时间调整通知', type: 'dislike', author: '图书馆', actionTime: '2026-01-15 09:10:00' }
])

const comments = ref([
    { contentTitle: '校园智慧平台使用指南', comment: '这个平台很好用，感谢开发团队！', commentTime: '2026-01-25 11:00:00' },
    { contentTitle: '2026年春季学期选课通知', comment: '选课系统什么时候开放？', commentTime: '2026-01-20 16:00:00' },
    { contentTitle: '图书馆开放时间调整通知', comment: '希望能延长周末开放时间', commentTime: '2026-01-15 10:00:00' }
])
</script>

<style scoped>
.interaction-container {
    padding: 20px;
}
</style>
