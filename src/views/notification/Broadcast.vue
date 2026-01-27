<template>
    <div class="notification-broadcast-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>群发设置</span>
                </div>
            </template>
            <el-form :model="form" label-width="100px">
                <el-form-item label="消息标题">
                    <el-input v-model="form.title" placeholder="请输入消息标题" />
                </el-form-item>
                <el-form-item label="消息类型">
                    <el-select v-model="form.type">
                        <el-option label="系统通知" value="system" />
                        <el-option label="活动通知" value="activity" />
                        <el-option label="紧急通知" value="urgent" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接收对象">
                    <el-radio-group v-model="form.target">
                        <el-radio label="all">全体用户</el-radio>
                        <el-radio label="role">指定角色</el-radio>
                        <el-radio label="user">指定用户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.target === 'role'" label="选择角色">
                    <el-select v-model="form.roles" multiple placeholder="请选择角色">
                        <el-option label="管理员" value="admin" />
                        <el-option label="教师" value="teacher" />
                        <el-option label="学生" value="student" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.target === 'user'" label="选择用户">
                    <el-select v-model="form.users" multiple placeholder="请选择用户">
                        <el-option label="张三" value="1" />
                        <el-option label="李四" value="2" />
                        <el-option label="王五" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="消息内容">
                    <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入消息内容" />
                </el-form-item>
                <el-form-item label="发送方式">
                    <el-checkbox-group v-model="form.methods">
                        <el-checkbox label="站内信">站内信</el-checkbox>
                        <el-checkbox label="email">邮件</el-checkbox>
                        <el-checkbox label="sms">短信</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="定时发送">
                    <el-switch v-model="form.isScheduled" />
                </el-form-item>
                <el-form-item v-if="form.isScheduled" label="发送时间">
                    <el-date-picker
                        v-model="form.scheduledTime"
                        type="datetime"
                        placeholder="选择发送时间"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSend">立即发送</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
    title: '',
    type: 'system',
    target: 'all',
    roles: [],
    users: [],
    content: '',
    methods: ['站内信'],
    isScheduled: false,
    scheduledTime: ''
})

const handleSend = () => {
    ElMessage.success('消息发送成功')
}

const handleReset = () => {
    form.title = ''
    form.type = 'system'
    form.target = 'all'
    form.roles = []
    form.users = []
    form.content = ''
    form.methods = ['站内信']
    form.isScheduled = false
    form.scheduledTime = ''
}
</script>

<style scoped>
.notification-broadcast-container {
    padding: 20px;
}
</style>
