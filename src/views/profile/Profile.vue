<template>
    <div class="p-6 bg-slate-50 flex items-center justify-center">
        <el-card class="w-full max-w-[1200px] rounded-2xl shadow-md border border-slate-200 h-full w-full overflow-hidden bg-white">
            <div class="flex gap-8 p-6 min-h-0">
                <!-- 左侧头像区域 -->
                <div class="flex-shrink-0 w-[140px] flex flex-col items-center justify-start pt-2">
                    <div class="relative text-center w-full">
                        <el-avatar :size="80" :src="form.avatar || defaultAvatar" class="border-3 border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 ease hover:scale-105 hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                            {{ form.realName ? form.realName.charAt(0) : '用' }}
                        </el-avatar>
                        <input 
                            ref="avatarInput" 
                            type="file" 
                            accept="image/*" 
                            class="hidden" 
                            @change="handleAvatarChange"
                        />
                        <el-button 
                            type="primary" 
                            size="small" 
                            class="mt-3 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ease bg-blue-600 border-none text-white w-full hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                            @click="handleUploadAvatar"
                            :loading="uploadingAvatar"
                        >
                            <el-icon><Camera /></el-icon>
                            {{ uploadingAvatar ? '上传中...' : '更换头像' }}
                        </el-button>
                    </div>
                </div>
                
                <!-- 右侧表单区域 -->
                <div class="flex-1 min-w-0 flex flex-col">
                    <el-tabs v-model="activeTab" class="flex-1 flex flex-col min-h-0 profile-tabs">
                        <!-- 基本信息标签页 -->
                        <el-tab-pane label="基本信息" name="basic">
                            <el-form :model="form" label-width="90px" :loading="loading">
                                <el-row :gutter="32">
                                    <el-col :span="12">
                                        <el-form-item label="学号:" prop="username" class="mb-4 flex items-center">
                                            <el-input v-model="form.username" disabled class="rounded-md h-10" />
                                        </el-form-item>
                                        <el-form-item label="真实姓名:" prop="realName" class="mb-4 flex items-center">
                                            <el-input v-model="form.realName" placeholder="请输入真实姓名" class="rounded-md h-10" />
                                        </el-form-item>
                                        <el-form-item label="邮箱:" prop="email" class="mb-4 flex items-center">
                                            <el-input v-model="form.email" type="email" placeholder="请输入邮箱" class="rounded-md h-10" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-row :gutter="32">
                                            <el-col :span="12">
                                                <el-form-item label="性别:" prop="gender" class="mb-4 flex items-center">
                                                    <el-radio-group v-model="form.gender">
                                                        <el-radio :value="1">男</el-radio>
                                                        <el-radio :value="2">女</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="所属角色:" prop="roles" class="mb-4 flex items-center">
                                                    <el-tag v-for="role in form.roles" :key="role.id" class="role-tag mr-1.5 mb-1.5 rounded-lg px-3 py-0.5 text-xs font-medium">
                                                        {{ role.name }}
                                                    </el-tag>
                                                    <el-tag v-if="form.roles.length === 0" type="info">
                                                        暂无角色
                                                    </el-tag>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-form-item label="生日:" prop="birthday" class="mb-4 flex items-center">
                                            <el-date-picker 
                                                v-model="form.birthday" 
                                                type="date" 
                                                placeholder="选择日期"
                                                class="w-full"
                                            />
                                        </el-form-item>
                                        <el-form-item label="手机号:" prop="phone" class="mb-4 flex items-center">
                                            <el-input v-model="form.phone" placeholder="请输入手机号" class="rounded-md h-10" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="个人简介:" prop="introduction" class="mb-4 flex items-center max-w-[880px]">
                                    <el-input 
                                        v-model="form.introduction" 
                                        type="textarea" 
                                        :rows="2" 
                                        placeholder="请输入个人简介"
                                    />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleSave" :loading="submitting" class="rounded-md px-6 py-2 text-base font-medium transition-all duration-200 ease hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] bg-blue-600 border-none hover:bg-blue-700 active:translate-y-0">
                                        保存
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        
                        <!-- 修改密码标签页 -->
                        <el-tab-pane label="修改密码" name="password">
                            <el-form :model="passwordForm" label-width="90px" class="password-form max-w-[400px]">
                                <el-form-item label="原密码" class="mb-4 flex items-center">
                                    <el-input v-model="passwordForm.oldPassword" type="password" class="rounded-md h-10" />
                                </el-form-item>
                                <el-form-item label="新密码" class="mb-4 flex items-center">
                                    <el-input v-model="passwordForm.newPassword" type="password" class="rounded-md h-10" />
                                </el-form-item>
                                <el-form-item label="确认密码" class="mb-4 flex items-center">
                                    <el-input v-model="passwordForm.confirmPassword" type="password" class="rounded-md h-10" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleUpdatePassword" :loading="passwordLoading" class="rounded-md px-6 py-2 text-base font-medium transition-all duration-200 ease hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] bg-blue-600 border-none hover:bg-blue-700 active:translate-y-0">
                                        修改密码
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import { userAPI } from '@/api/user'
import { authAPI } from '@/api/auth'
import { uploadAPI } from '@/api/upload'

const loading = ref(false)
const submitting = ref(false)
const passwordLoading = ref(false)
const uploadingAvatar = ref(false)
const avatarInput = ref(null)
const activeTab = ref('basic')
const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20placeholder&image_size=square'

const form = reactive({
    id: '',
    username: '',
    realName: '',
    email: '',
    phone: '',
    gender: 1,
    birthday: '',
    introduction: '',
    avatar: '',
    roles: []
})

const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const handleUploadAvatar = () => {
    avatarInput.value?.click()
}

const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return
    }
    
    if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB')
        return
    }
    
    uploadingAvatar.value = true
    try {
        const uploadRes = await uploadAPI.uploadImage(file)
        form.avatar = uploadRes.data.url
        
        const updateData = {
            id: form.id,
            username: form.username,
            real_name: form.realName,
            email: form.email,
            phone: form.phone,
            gender: form.gender,
            birthday: form.birthday,
            introduction: form.introduction,
            avatar: uploadRes.data.url
        }
        
        await userAPI.update(updateData)
        
        const userInfoStr = localStorage.getItem('userInfo')
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr)
            userInfo.avatar = uploadRes.data.url
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
        
        ElMessage.success('头像更新成功')
    } catch (error) {
        console.error('头像更新失败:', error)
        ElMessage.error('头像更新失败')
    } finally {
        uploadingAvatar.value = false
        if (avatarInput.value) {
            avatarInput.value.value = ''
        }
    }
}

const getUserProfile = async () => {
    loading.value = true
    try {
        const userInfoStr = localStorage.getItem('userInfo')
        if (!userInfoStr) {
            ElMessage.error('未找到用户信息，请重新登录')
            return
        }
        const userInfo = JSON.parse(userInfoStr)
        const userId = userInfo.userId
        if (!userId) {
            ElMessage.error('未找到用户ID，请重新登录')
            return
        }
        const res = await userAPI.getById(userId)
        const userData = res.data
        console.log('用户数据:', userData)
        form.id = userData.id
        form.username = userData.username
        form.realName = userData.realName
        form.email = userData.email
        form.phone = userData.phone
        form.gender = userData.gender || 1
        form.birthday = userData.birthday
        form.introduction = userData.introduction
        form.avatar = userData.avatar
        if (userData.roles && Array.isArray(userData.roles)) {
            form.roles = userData.roles
            console.log('角色数据:', form.roles)
        } else {
            form.roles = []
            console.log('角色数据为空')
        }
    } catch (error) {
        console.error('获取个人档案失败:', error)
        ElMessage.error('获取个人档案失败')
    } finally {
        loading.value = false
    }
}

const handleSave = async () => {
    submitting.value = true
    try {
        if (!form.username) {
            ElMessage.error('学号不能为空')
            submitting.value = false
            return
        }
        if (!form.realName) {
            ElMessage.error('真实姓名不能为空')
            submitting.value = false
            return
        }
        
        let formattedBirthday = null
        if (form.birthday) {
            if (typeof form.birthday === 'string') {
                formattedBirthday = form.birthday
            } else if (form.birthday instanceof Date) {
                formattedBirthday = form.birthday.toISOString().split('T')[0]
            }
        }
        
        const updateData = {
            id: form.id,
            username: form.username,
            real_name: form.realName,
            email: form.email,
            phone: form.phone,
            gender: form.gender,
            birthday: formattedBirthday,
            introduction: form.introduction,
            avatar: form.avatar
        }
        
        await userAPI.update(updateData)
        
        const userInfoStr = localStorage.getItem('userInfo')
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr)
            userInfo.avatar = form.avatar
            userInfo.realName = form.realName
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
        
        ElMessage.success('保存成功')
    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error(error.response?.data?.message || '保存失败，请稍后重试')
    } finally {
        submitting.value = false
    }
}

const handleUpdatePassword = async () => {
    if (!passwordForm.oldPassword) {
        ElMessage.error('请输入原密码')
        return
    }
    if (!passwordForm.newPassword) {
        ElMessage.error('请输入新密码')
        return
    }
    if (!passwordForm.confirmPassword) {
        ElMessage.error('请输入确认密码')
        return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        ElMessage.error('新密码和确认密码不一致')
        return
    }
    if (passwordForm.newPassword.length < 6) {
        ElMessage.error('新密码长度不能少于6位')
        return
    }
    
    passwordLoading.value = true
    try {
        await authAPI.changePassword(
            passwordForm.oldPassword,
            passwordForm.newPassword,
            passwordForm.confirmPassword
        )
        ElMessage.success('密码修改成功')
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
    } catch (error) {
        console.error('密码修改失败:', error)
        ElMessage.error(error.response?.data?.message || '密码修改失败，请稍后重试')
    } finally {
        passwordLoading.value = false
    }
}

onMounted(() => {
    getUserProfile()
})
</script>

<style scoped>
.profile-tabs :deep(.el-tabs__header) {
    margin-bottom:1rem;
    border-bottom: 2px solid #E2E8F0;
    flex-shrink: 0;
}

.profile-tabs :deep(.el-tabs__item) {
    font-size: 0.9375rem;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    color: #64748B;
    transition: all 0.2s ease;
    position: relative;
}

.profile-tabs :deep(.el-tabs__item:hover) {
    color: #2563EB;
}

.profile-tabs :deep(.el-tabs__item.is-active) {
    color: #2563EB;
    font-weight: 600;
}

.profile-tabs :deep(.el-tabs__active-bar) {
    background-color: #2563EB;
    height: 2px;
    border-radius: 2px 2px 0 0;
}

.profile-tabs :deep(.el-tabs__content) {
    flex: 1;
    overflow-y: auto;
}

.el-form-item :deep(.el-form-item__label) {
    font-weight: 600;
    color: #334155;
    font-size: 0.875rem;
    line-height: 1.5;
    display: flex;
    align-items: center;
    height: 40px;
}

.el-form-item :deep(.el-form-item__content) {
    max-width: 250px;
}

.el-form-item:has(.el-textarea) :deep(.el-form-item__content) {
    max-width: none;
}

.el-input {
    border-radius: 6px;
    height: 40px;
}

.el-input :deep(.el-input__wrapper) {
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #CBD5E1;
    transition: all 0.2s ease;
}

.el-input :deep(.el-input__wrapper:hover) {
    border-color: #94A3B8;
}

.el-input :deep(.el-input__wrapper.is-focus) {
    border-color: #2563EB;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .profile-content {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .avatar-section {
        width: 100%;
        flex-direction: row;
        justify-content: center;
        gap: 1.5rem;
    }
    
    .avatar-container {
        width: auto;
    }
    
    .avatar-upload-btn {
        width: auto;
    }
}

@media (max-width: 768px) {
    .profile-container {
        padding: 1rem;
    }
    
    .profile-card {
        border-radius: 12px;
    }
    
    .card-header {
        font-size: 1.125rem;
        padding: 0.875rem 1.25rem;
    }
    
    .profile-content {
        padding: 1.25rem;
        gap: 1.25rem;
    }
    
    .profile-tabs :deep(.el-tabs__item) {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
    }
    
    .el-col {
        width: 100%;
    }
    
    .password-form {
        max-width: 100%;
    }
}
</style>
