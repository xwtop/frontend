<template>
    <div class="security-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>安全中心</span>
                </div>
            </template>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="修改密码" name="password">
                    <el-form :model="passwordForm" label-width="100px">
                        <el-form-item label="原密码">
                            <el-input v-model="passwordForm.oldPassword" type="password" />
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="passwordForm.newPassword" type="password" />
                        </el-form-item>
                        <el-form-item label="确认密码">
                            <el-input v-model="passwordForm.confirmPassword" type="password" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleUpdatePassword">修改密码</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="登录记录" name="login">
                    <el-table :data="loginRecords">
                        <el-table-column prop="time" label="登录时间" />
                        <el-table-column prop="ip" label="IP地址" />
                        <el-table-column prop="location" label="登录地点" />
                        <el-table-column prop="device" label="设备" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('password')

const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const loginRecords = ref([
    { time: '2026-01-27 10:30:00', ip: '192.168.1.100', location: '北京', device: 'Chrome' },
    { time: '2026-01-26 15:20:00', ip: '192.168.1.101', location: '上海', device: 'Firefox' }
])

const handleUpdatePassword = () => {
    ElMessage.success('密码修改成功')
}
</script>

<style scoped>
.security-container {
    padding: 20px;
}
</style>
