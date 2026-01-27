<template>
    <div class="profile-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>个人档案</span>
                </div>
            </template>
            <el-form :model="form" label-width="100px">
                <el-form-item label="学号">
                    <el-input v-model="form.username" disabled />
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="form.realName" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                        <el-radio :value="1">男</el-radio>
                        <el-radio :value="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input v-model="form.introduction" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
    username: '',
    realName: '',
    email: '',
    phone: '',
    gender: 1,
    birthday: '',
    introduction: ''
})

const handleSave = () => {
    ElMessage.success('保存成功')
}
</script>

<style scoped>
.profile-container {
    padding: 20px;
}
</style>
