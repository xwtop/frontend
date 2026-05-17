<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-[120px]"></div>
            <div class="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-secondary-200/20 rounded-full blur-[100px]"></div>
        </div>

        <div class="relative z-10 w-full max-w-md px-6">
            <div class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <span class="font-bold text-3xl">智</span>
                    </div>
                    <h1 class="text-3xl font-bold text-slate-900 mb-2">欢迎回来</h1>
                    <p class="text-slate-600">登录校园智通，开启智慧校园生活</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-sm font-semibold text-slate-700">学号</label>
                        <div class="relative">
                            <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                v-model="studentId"
                                type="text"
                                placeholder="请输入学号"
                                class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-semibold text-slate-700">密码</label>
                        <div class="relative">
                            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                v-model="password"
                                type="password"
                                placeholder="请输入密码"
                                class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <span class="text-slate-600">记住我</span>
                        </label>
                        <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">忘记密码？</a>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span v-else>登录</span>
                        <ArrowRight v-if="!isLoading" class="w-5 h-5" />
                    </button>
                </form>

                <div class="mt-8 text-center">
                    <p class="text-slate-600">
                        还没有账号？
                        <button @click="goToRegister" class="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                            立即注册
                        </button>
                    </p>
                </div>

                <div class="mt-6 pt-6 border-t border-slate-200 text-center">
                    <button @click="router.push('/')" class="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
                        返回首页
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, ArrowRight } from 'lucide-vue-next'
import { authAPI } from '@/api/auth'

const router = useRouter()

const studentId = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    isLoading.value = true
    
    try {
        const response = await authAPI.login(studentId.value, password.value)
        
        if (response.status === 200) {
            localStorage.setItem('token', response.data.accessToken)
            localStorage.setItem('userInfo', JSON.stringify({
                userId: response.data.userId,
                realName: response.data.realName,
                role: response.data.role,
                roleName: response.data.roleName
            }))
            ElMessage.success('登录成功！')
            router.push('/admin/dashboard')
        }
    } catch (error) {
    } finally {
        isLoading.value = false
    }
}

const goToRegister = () => {
    router.push('/register')
}
</script>