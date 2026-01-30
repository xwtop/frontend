<template>
    <div class="comment-item" :class="{ 'ml-12': !isRoot }">
        <div class="flex items-start gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 mt-1">
                {{ comment.userName?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <div class="font-medium text-gray-900 truncate">{{ comment.userName }}</div>
                    <div class="text-sm text-gray-500 flex-shrink-0">{{ formatTime(comment.createTime) }}</div>
                </div>
                <div class="text-gray-700 leading-relaxed break-words mb-2">
                    {{ comment.content }}
                </div>
                <div class="flex items-center gap-4 text-sm">
                    <button
                        @click="$emit('reply', comment)"
                        class="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <el-icon><ChatDotRound /></el-icon>
                        <span>回复</span>
                    </button>
                    <button
                        @click="$emit('delete', comment)"
                        class="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <el-icon><Delete /></el-icon>
                        <span>删除</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div v-if="comment.children && comment.children.length > 0" class="mt-2">
            <CommentNode
                v-for="child in comment.children"
                :key="child.id"
                :comment="child"
                :is-root="false"
                @reply="$emit('reply', $event)"
                @delete="$emit('delete', $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { ChatDotRound, Delete } from '@element-plus/icons-vue'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    isRoot: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['reply', 'delete'])

const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<style scoped>
.comment-item {
    margin-bottom: 1rem;
}
</style>
