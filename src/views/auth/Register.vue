<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 relative overflow-hidden py-12">
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-[120px]"></div>
            <div class="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-secondary-200/20 rounded-full blur-[100px]"></div>
        </div>

        <div class="relative z-10 w-full max-w-4xl px-6">
            <div class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <span class="font-bold text-3xl">智</span>
                    </div>
                    <h1 class="text-3xl font-bold text-slate-900 mb-2">创建账号</h1>
                    <p class="text-slate-600">加入校园智通，开启智慧校园生活</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-5">
                    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {{ errorMessage }}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            <label class="text-sm font-semibold text-slate-700">真实姓名</label>
                            <div class="relative">
                                <UserCircle class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    v-model="realName"
                                    type="text"
                                    placeholder="请输入真实姓名"
                                    class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700">邮箱</label>
                            <div class="relative">
                                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    v-model="email"
                                    type="email"
                                    placeholder="请输入邮箱"
                                    class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700">邮箱验证码</label>
                            <div class="flex gap-3">
                                <div class="relative flex-1">
                                    <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        v-model="verifyCode"
                                        type="text"
                                        placeholder="请输入验证码"
                                        class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    @click="sendVerifyCode"
                                    :disabled="countdown > 0"
                                    class="px-6 py-3 bg-primary-100 text-primary-700 rounded-xl font-semibold hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                                </button>
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

                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700">确认密码</label>
                            <div class="relative">
                                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    v-model="confirmPassword"
                                    type="password"
                                    placeholder="请再次输入密码"
                                    class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span v-else>注册</span>
                        <ArrowRight v-if="!isLoading" class="w-5 h-5" />
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-slate-600">
                        已有账号？
                        <button @click="goToLogin" class="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                            立即登录
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
import { User, UserCircle, Mail, Lock, ArrowRight } from 'lucide-vue-next'
import { authAPI } from '../../api/auth'

const router = useRouter()

const studentId = ref('')
const realName = ref('')
const email = ref('')
const verifyCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const countdown = ref(0)
const errorMessage = ref('')

const sendVerifyCode = () => {
    if (!email.value) {
        ElMessage.warning('请先输入邮箱')
        return
    }
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
    ElMessage.success('验证码已发送（模拟）')
}

const handleRegister = async () => {
    errorMessage.value = ''
    
    if (password.value !== confirmPassword.value) {
        errorMessage.value = '两次输入的密码不一致'
        ElMessage.error('两次输入的密码不一致')
        return
    }
    
    isLoading.value = true
    
    try {
        const response = await authAPI.register(
            studentId.value,
            password.value,
            realName.value,
            email.value,
            verifyCode.value || '0000'
        )
        
        if (response.status === 200) {
            ElMessage.success('注册成功！请登录')
            router.push('/login')
        } else {
            errorMessage.value = response.statusText || '注册失败'
            ElMessage.error(response.statusText || '注册失败')
        }
    } catch (error) {
        errorMessage.value = error.message || '注册失败，请检查输入信息'
        ElMessage.error(error.message || '注册失败，请检查输入信息')
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    router.push('/login')
}
</script>
