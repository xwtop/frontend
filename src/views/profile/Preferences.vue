<template>
    <div class="preferences-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>偏好设置</span>
                </div>
            </template>
            <el-form label-width="120px">
                <el-form-item label="主题风格">
                    <el-radio-group v-model="theme">
                        <el-radio label="light">浅色</el-radio>
                        <el-radio label="dark">深色</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="语言设置">
                    <el-select v-model="language">
                        <el-option label="简体中文" value="zh-CN" />
                        <el-option label="English" value="en-US" />
                    </el-select>
                </el-form-item>
                <el-form-item label="通知设置">
                    <el-checkbox-group v-model="notifications">
                        <el-checkbox label="email">邮件通知</el-checkbox>
                        <el-checkbox label="sms">短信通知</el-checkbox>
                        <el-checkbox label="push">推送通知</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">保存设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const theme = ref('light')
const language = ref('zh-CN')
const notifications = ref(['push'])

const handleSave = () => {
    ElMessage.success('设置已保存')
}
</script>

<style scoped>
.preferences-container {
    padding: 20px;
}
</style>
