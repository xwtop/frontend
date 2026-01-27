<script setup>
import { useWindowScroll } from '@vueuse/core'
import { ArrowRight, Activity, Users, FileText, Menu, X, BookOpen, GraduationCap, Calendar, Coffee, Search, Bell, Shield, Smartphone, MoreHorizontal, MessageSquare, Heart, Share2, ThumbsUp, Github, Twitter, Linkedin } from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { y } = useWindowScroll()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const checkScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', checkScroll))
onUnmounted(() => window.removeEventListener('scroll', checkScroll))

const goToLogin = () => {
    router.push('/login')
}

const goToRegister = () => {
    router.push('/register')
}

const navLinks = [
    { name: '功能概览', href: '#features' },
    { name: '数据中心', href: '#dashboard' },
    { name: '校园社区', href: '#community' },
    { name: '关于我们', href: '#footer' },
]

const notices = [
    "【教务处】关于2026年春季学期选课的通知",
    "【图书馆】端午节闭馆安排公告",
    "【考研】2027年研究生入学考试报名流程指南",
    "【四六级】第75次CET考试成绩查询入口已开放"
]

const bgY = computed(() => `translateY(${y.value * 0.5}px)`)
const circle1Y = computed(() => `translateY(${y.value * 0.2}px)`)
const circle2Y = computed(() => `translateY(${-y.value * 0.1}px)`)
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-slate-50">
        
        <!-- Parallax Background Layers -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-teal-50 opacity-80" :style="{ transform: bgY }"></div>
            <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-[120px]" :style="{ transform: circle1Y }"></div>
            <div class="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-secondary-200/20 rounded-full blur-[100px]" :style="{ transform: circle2Y }"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10">
            
            <!-- NavBar -->
            <header :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6']">
                <div class="container mx-auto px-6 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <span class="font-bold text-xl">智</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-lg font-bold text-slate-900 leading-none">校园智通</span>
                            <span class="text-xs text-slate-500 font-medium tracking-wider">CAMPUS PORTAL</span>
                        </div>
                    </div>

                    <nav class="hidden md:flex items-center gap-8">
                        <a v-for="link in navLinks" :key="link.name" :href="link.href" class="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                            {{ link.name }}
                        </a>
                        <button @click="goToLogin" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 transform hover:-translate-y-0.5 cursor-pointer">
                            登录系统
                        </button>
                    </nav>

                    <button class="md:hidden text-slate-700" @click="isMenuOpen = !isMenuOpen">
                        <Menu v-if="!isMenuOpen" />
                        <X v-else />
                    </button>
                </div>

                <div v-show="isMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 flex flex-col gap-2">
                    <a v-for="link in navLinks" :key="link.name" :href="link.href" @click="isMenuOpen = false" class="p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                        {{ link.name }}
                    </a>
                    <button @click="goToLogin" class="w-full bg-primary-600 text-white py-3 rounded-lg font-bold mt-2 cursor-pointer">
                        登录系统
                    </button>
                </div>
            </header>

            <main>
                <!-- Hero Section -->
                <section class="min-h-screen flex flex-col justify-center pt-20 relative">
                    <div class="container mx-auto px-12 grid lg:grid-cols-2 gap-12 items-center">
                        
                        <div class="space-y-8 animate-fade-in-up">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-semibold backdrop-blur-sm">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                System Online v3.0 // 智慧校园综合服务平台
                            </div>

                            <h1 class="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                                连接 <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">每一位师生</span><br>
                                服务 <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">成长的每一步</span>
                            </h1>

                            <p class="text-lg text-slate-600 max-w-xl leading-relaxed">
                                不仅是信息门户，更是您的智能校园助理。集成教务管理、考试资讯、社群互动与大数据推荐，基于 Flask + Vue3 的新一代校园生态系统。
                            </p>

                            <div class="flex gap-4">
                                <button @click="goToRegister" class="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer">
                                    立即开始使用
                                    <ArrowRight class="w-5 h-5" />
                                </button>
                                <button class="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
                                    查看开发者文档
                                </button>
                            </div>

                            <div class="pt-8 border-t border-slate-200 grid grid-cols-3 gap-8">
                                <div>
                                    <div class="text-3xl font-bold text-slate-900">2W+</div>
                                    <div class="text-sm text-slate-500">日活跃用户</div>
                                </div>
                                <div>
                                    <div class="text-3xl font-bold text-slate-900">50+</div>
                                    <div class="text-sm text-slate-500">接入子系统</div>
                                </div>
                                <div>
                                    <div class="text-3xl font-bold text-slate-900">99.9%</div>
                                    <div class="text-sm text-slate-500">服务可用性</div>
                                </div>
                            </div>
                        </div>

                        <div class="relative lg:h-[600px] flex items-center justify-center perspective-1000">
                            <div class="absolute inset-0 bg-gradient-to-tr from-primary-100 to-secondary-100 rounded-full blur-3xl opacity-50 animate-float"></div>

                            <div class="relative w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-2xl transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                            <Activity class="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-slate-800">实时数据监控</div>
                                            <div class="text-xs text-slate-500">Real-time Information</div>
                                        </div>
                                    </div>
                                    <div class="h-2 w-2 bg-green-500 rounded-full"></div>
                                </div>

                                <div class="space-y-4">
                                    <div class="bg-white/50 p-4 rounded-xl border border-white/30 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><FileText class="w-4 h-4"/></div>
                                            <span class="font-medium text-slate-700 text-sm">教务通知更新</span>
                                        </div>
                                        <span class="text-xs font-bold text-green-600">+12</span>
                                    </div>
                                    
                                    <div class="bg-white/50 p-4 rounded-xl border border-white/30">
                                        <div class="flex justify-between text-xs text-slate-500 mb-2">
                                            <span>考研倒计时</span>
                                            <span>325天</span>
                                        </div>
                                        <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div class="h-full w-1/4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="bg-primary-600 p-4 rounded-xl text-white shadow-lg shadow-primary-500/30">
                                            <div class="text-2xl font-bold">CET-4</div>
                                            <div class="text-xs opacity-80">查分入口开启</div>
                                        </div>
                                        <div class="bg-white/50 p-4 rounded-xl border border-white/30 flex items-center justify-center">
                                            <div class="text-center">
                                                <div class="text-lg font-bold text-slate-800">18:30</div>
                                                <div class="text-xs text-slate-500">图书馆闭馆</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="absolute -right-8 top-12 bg-white p-4 rounded-2xl shadow-xl animate-float" style="animation-delay: 1s;">
                                    <div class="flex items-center gap-3">
                                        <Users class="w-5 h-5 text-secondary-500" />
                                        <div class="text-sm font-bold text-slate-700">在线人数 4,281</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 overflow-hidden">
                        <div class="flex whitespace-nowrap animate-marquee">
                            <div v-for="i in 4" :key="i" class="flex items-center gap-12 mx-4">
                                <span v-for="notice in notices" :key="notice" class="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
                                    {{ notice }}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Feature Section -->
                <section id="features" class="section-padding relative">
                    <div class="container mx-auto px-12 space-y-32">
                        
                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div class="order-2 lg:order-1 relative h-[500px] w-full flex items-center justify-center">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-[3rem] transform -rotate-3 scale-95"></div>
                                
                                <div class="relative w-full h-full rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl overflow-hidden group">
                                    <div class="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl"></div>
                                    
                                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
                                        <div class="absolute top-0 right-0 w-48 h-64 bg-white/60 rounded-2xl shadow-lg transform rotate-12 transition-transform duration-700 group-hover:rotate-[15deg] group-hover:translate-x-4"></div>
                                        <div class="absolute top-8 left-8 w-48 h-64 bg-blue-50/80 rounded-2xl shadow-lg transform -rotate-6 transition-transform duration-700 group-hover:-rotate-[10deg] group-hover:-translate-x-4"></div>
                                        <div class="absolute top-12 left-1/2 transform -translate-x-1/2 w-56 h-72 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl flex flex-col p-6 transition-transform duration-500 group-hover:scale-105">
                                            <div class="w-12 h-12 bg-primary-100 rounded-full mb-4 flex items-center justify-center text-primary-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                            </div>
                                            <div class="space-y-3">
                                                <div class="h-3 bg-slate-200 rounded-full w-3/4"></div>
                                                <div class="h-3 bg-slate-200 rounded-full w-full"></div>
                                                <div class="h-3 bg-slate-200 rounded-full w-5/6"></div>
                                                <div class="h-3 bg-slate-200 rounded-full w-2/3"></div>
                                            </div>
                                            <div class="mt-auto flex items-center gap-2">
                                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                                                <span class="text-xs text-slate-500 font-medium">Verified Source</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl max-w-xs animate-float">
                                    <p class="text-sm font-medium text-slate-600">"Since using Campus Portal, I never miss a notification."</p>
                                    <div class="mt-4 flex items-center gap-3">
                                        <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                                        <div class="text-xs font-bold text-slate-900">Zhang Wei, CS Dept</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-1 lg:order-2 space-y-6">
                                <div class="inline-block text-primary-600 font-bold tracking-wider text-sm uppercase">Information Hub</div>
                                <h2 class="text-4xl font-bold text-slate-900 leading-tight">海量资讯，<br>一站式聚合</h2>
                                <p class="text-lg text-slate-600">
                                    打破信息孤岛。我们在一个统一的平台上汇集了来自教务、学工、图书馆以及各大社团的动态。通过智能标签和分类系统，确保您不错过任何重要信息。
                                </p>
                                
                                <ul class="space-y-4 pt-4">
                                    <li class="flex items-start gap-4">
                                        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Search class="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-800">智能检索</h4>
                                            <p class="text-sm text-slate-500">支持模糊搜索与多维度筛选，快速定位目标信息。</p>
                                        </div>
                                    </li>
                                    <li class="flex items-start gap-4">
                                        <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Bell class="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-800">个性化订阅</h4>
                                            <p class="text-sm text-slate-500">关注特定的标签或部门，即时获取推送通知。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div class="space-y-8">
                                <div class="inline-block text-secondary-600 font-bold tracking-wider text-sm uppercase">Productivity Tools</div>
                                <h2 class="text-4xl font-bold text-slate-900 leading-tight">丰富的功能矩阵，<br>覆盖学习生活全场景</h2>
                                <p class="text-lg text-slate-600">
                                    无需在多个App之间切换。从查询课表到四六级报名，从考研资料分享到二手交易，都在这里。
                                </p>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                                        <BookOpen class="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                                        <h4 class="font-bold text-slate-800">课程管理</h4>
                                        <p class="text-xs text-slate-500 mt-1">课表查询与选课辅助</p>
                                    </div>
                                    <div class="p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                                        <GraduationCap class="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                                        <h4 class="font-bold text-slate-800">考研专区</h4>
                                        <p class="text-xs text-slate-500 mt-1">资料共享与经验交流</p>
                                    </div>
                                    <div class="p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                                        <Calendar class="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                                        <h4 class="font-bold text-slate-800">活动报名</h4>
                                        <p class="text-xs text-slate-500 mt-1">社团活动一键参与</p>
                                    </div>
                                    <div class="p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                                        <Coffee class="w-8 h-8 text-amber-900 mb-3 group-hover:scale-110 transition-transform" />
                                        <h4 class="font-bold text-slate-800">生活服务</h4>
                                        <p class="text-xs text-slate-500 mt-1">失物招领与跳蚤市场</p>
                                    </div>
                                </div>
                            </div>

                            <div class="relative grid grid-cols-2 gap-4">
                                <div class="space-y-4 mt-8">
                                    <div class="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                                        <div class="text-xs font-bold text-slate-400 mb-1">NEXT CLASS</div>
                                        <div class="font-bold text-slate-800">Data Structures</div>
                                        <div class="text-xs text-slate-500">Rm 304, 14:00</div>
                                    </div>
                                    <div class="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-teal-500 opacity-60">
                                        <div class="text-xs font-bold text-slate-400 mb-1">ACTIVITY</div>
                                        <div class="font-bold text-slate-800">Music Festival</div>
                                    </div>
                                </div>
                                <div class="space-y-4">
                                    <div class="bg-slate-900 p-6 rounded-2xl shadow-2xl text-white">
                                        <div class="flex items-center gap-2 mb-4">
                                            <Shield class="w-5 h-5 text-green-400" />
                                            <span class="font-bold">Secure Access</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="h-2 bg-slate-700 rounded-full w-3/4"></div>
                                            <div class="h-2 bg-slate-700 rounded-full w-1/2"></div>
                                        </div>
                                    </div>
                                    <div class="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-2xl shadow-xl text-white flex items-center justify-between">
                                        <div>
                                            <div class="text-2xl font-bold">95%</div>
                                            <div class="text-xs opacity-80">Satisfaction</div>
                                        </div>
                                        <Smartphone class="w-8 h-8 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Data Dashboard Section -->
                <section id="dashboard" class="py-24 bg-slate-900 relative overflow-hidden text-white">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-900/40 blur-[100px] rounded-full pointer-events-none"></div>

                    <div class="container mx-auto px-12 relative z-10">
                        <div class="text-center mb-16 max-w-2xl mx-auto">
                            <h2 class="text-3xl lg:text-5xl font-bold mb-6">大数据驱动的决策支持</h2>
                            <p class="text-slate-400 text-lg">
                                不仅服务于学生，更为学校管理者提供实时的数据洞察。从流量分析到热点监控，一切尽在掌握。
                            </p>
                        </div>

                        <div class="glass-dark rounded-3xl p-6 border border-slate-700/50 shadow-2xl grid lg:grid-cols-4 lg:grid-rows-2 gap-6 h-auto lg:h-[600px]">
                            
                            <div class="lg:col-span-2 lg:row-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col">
                                <div class="flex justify-between items-center mb-6">
                                    <h4 class="font-bold text-slate-200">全校活跃度趋势</h4>
                                    <div class="flex gap-2">
                                        <div class="w-3 h-3 bg-primary-500 rounded-full"></div>
                                        <div class="w-3 h-3 bg-secondary-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div class="flex-grow flex items-end justify-between gap-2 px-2 pb-4">
                                    <div class="w-full bg-slate-700/30 rounded-t-lg relative h-[40%] group hover:bg-primary-500/20 transition-colors">
                                        <div class="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg h-[60%] transition-all duration-1000 group-hover:h-[65%]"></div>
                                    </div>
                                    <div class="w-full bg-slate-700/30 rounded-t-lg relative h-[60%] group hover:bg-primary-500/20 transition-colors">
                                        <div class="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg h-[40%] transition-all duration-1000 group-hover:h-[45%]"></div>
                                    </div>
                                    <div class="w-full bg-slate-700/30 rounded-t-lg relative h-[50%] group hover:bg-primary-500/20 transition-colors">
                                        <div class="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg h-[80%] transition-all duration-1000 group-hover:h-[85%]"></div>
                                    </div>
                                    <div class="w-full bg-slate-700/30 rounded-t-lg relative h-[70%] group hover:bg-primary-500/20 transition-colors">
                                        <div class="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg h-[50%] transition-all duration-1000 group-hover:h-[55%]"></div>
                                    </div>
                                    <div class="w-full bg-slate-700/30 rounded-t-lg relative h-[80%] group hover:bg-primary-500/20 transition-colors">
                                        <div class="absolute bottom-0 left-0 right-0 bg-secondary-500 rounded-t-lg h-[90%] shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all duration-1000 group-hover:h-[95%]"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                <h4 class="absolute top-4 left-4 font-bold text-slate-200 text-sm">热门板块分布</h4>
                                <div class="w-32 h-32 rounded-full border-8 border-slate-700 relative">
                                    <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                                        <path class="text-primary-500" stroke-dasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" />
                                        <path class="text-secondary-500" stroke-dasharray="20, 100" stroke-dashoffset="-75" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4"/>
                                    </svg>
                                    <div class="absolute inset-0 flex items-center justify-center text-xl font-bold">
                                        70%
                                    </div>
                                </div>
                            </div>

                            <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div class="flex justify-between mb-4">
                                    <h4 class="font-bold text-slate-200 text-sm">实时搜索热词</h4>
                                    <MoreHorizontal class="w-4 h-4 text-slate-500" />
                                </div>
                                <ul class="space-y-3 text-sm">
                                    <li class="flex justify-between">
                                        <span class="text-slate-400">1. 考研复试</span>
                                        <span class="text-green-400 font-mono">↗ 12%</span>
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="text-slate-400">2. 选课指南</span>
                                        <span class="text-green-400 font-mono">↗ 8%</span>
                                    </li>
                                    <li class="flex justify-between">
                                        <span class="text-slate-400">3. 奖学金</span>
                                        <span class="text-red-400 font-mono">↘ 3%</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="lg:col-span-2 bg-gradient-to-r from-primary-900 to-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center justify-between">
                                <div>
                                    <div class="text-slate-400 text-sm mb-1">系统安全运行时间</div>
                                    <div class="text-3xl font-mono font-bold text-white">432 Days <span class="text-base font-normal text-slate-500">12:30:05</span></div>
                                </div>
                                <div class="h-12 w-32 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
                                    <span class="flex items-center gap-2 text-green-400 text-sm font-bold">
                                        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Normal
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <!-- Community Hub Section -->
                <section id="community" class="section-padding bg-slate-50">
                    <div class="container mx-auto px-12">
                        <div class="text-center mb-16">
                            <h2 class="text-4xl font-bold text-slate-900">活跃的校园社区</h2>
                            <p class="text-lg text-slate-600 mt-4">思维的碰撞，信息的共享</p>
                        </div>

                        <div class="grid md:grid-cols-3 gap-6">
                            <div class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                                    <div>
                                        <div class="font-bold text-slate-900">匿名同学</div>
                                        <div class="text-xs text-slate-500">10分钟前</div>
                                    </div>
                                </div>
                                <p class="text-slate-700 leading-relaxed mb-4">
                                    有没有大佬知道计算机学院的王教授今年还招研究生吗？求推荐一些复习资料！🙏
                                </p>
                                <div class="flex items-center gap-4 text-slate-400 text-sm">
                                    <span class="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors"><Heart class="w-4 h-4" /> 24</span>
                                    <span class="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors"><MessageSquare class="w-4 h-4" /> 18</span>
                                </div>
                            </div>

                            <div class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                                    <div>
                                        <div class="font-bold text-slate-900">摄影社</div>
                                        <div class="text-xs text-slate-500">2小时前</div>
                                    </div>
                                </div>
                                <div class="h-40 bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl mb-4 overflow-hidden relative group-hover:opacity-90 transition-opacity flex items-center justify-center">
                                    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#F97316 2px, transparent 2px); background-size: 16px 16px;"></div>
                                    <div class="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl shadow-sm">🌸</div>
                                </div>
                                <p class="text-slate-700 leading-relaxed mb-4">
                                    本周末的校园樱花节，欢迎大家来打卡！📸
                                </p>
                                <div class="flex items-center gap-4 text-slate-400 text-sm">
                                    <span class="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors"><Heart class="w-4 h-4" /> 156</span>
                                </div>
                            </div>

                            <div class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                                <span class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold mb-4 inline-block">HOT 🔥</span>
                                <h3 class="font-bold text-lg text-slate-900 mb-2">关于食堂新增窗口的意见征集</h3>
                                <p class="text-slate-500 text-sm mb-6">
                                    为了丰富大家的饮食选择，后勤处拟引进新的餐饮品牌...
                                </p>
                                <button class="w-full py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                                    参与投票
                                </button>
                            </div>
                        </div>

                        <div class="mt-24 p-12 rounded-[3rem] bg-gradient-to-r from-primary-600 to-secondary-600 text-center text-white relative overflow-hidden">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div class="relative z-10">
                                <h2 class="text-4xl font-bold mb-6">准备好开启智慧生活了吗？</h2>
                                <p class="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                                    加入超过 20,000 名师生的行列，体验更高效的校园服务。
                                </p>
                                <div class="flex justify-center gap-4">
                                    <button @click="goToRegister" class="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer">
                                        立即注册帐号
                                    </button>
                                    <button class="bg-transparent border border-white/40 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                        下载官方App
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer id="footer" class="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
                <div class="container mx-auto px-12 grid md:grid-cols-4 gap-12">
                    <div class="col-span-1 md:col-span-2">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <span class="font-bold text-xl">智</span>
                            </div>
                            <span class="text-2xl font-bold text-white">校园智通</span>
                        </div>
                        <p class="max-w-md text-slate-500 mb-6">
                            致力于打造最智能、最便捷的高校综合信息服务平台。连接师生，赋能教育。
                        </p>
                        <div class="flex gap-4">
                            <a href="#" class="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors"><Github class="w-5 h-5"/></a>
                            <a href="#" class="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors"><Twitter class="w-5 h-5"/></a>
                            <a href="#" class="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors"><Linkedin class="w-5 h-5"/></a>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-white font-bold mb-6">产品服务</h4>
                        <ul class="space-y-3">
                            <li><a href="#" class="hover:text-white transition-colors">功能介绍</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">API 文档</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">版本更新</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">App 下载</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-bold mb-6">支持与帮助</h4>
                        <ul class="space-y-3">
                            <li><a href="#" class="hover:text-white transition-colors">使用指南</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">常见问题</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">隐私政策</a></li>
                        </ul>
                    </div>
                </div>
                <div class="container mx-auto px-6 pt-12 mt-12 border-t border-slate-800 text-center text-sm">
                    &copy; 2026 校园智通 (Campus Portal). All rights reserved. Built with Vue 3 & Tailwind.
                </div>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}
.rotate-y-12 {
    transform: rotateY(-12deg) rotateX(5deg);
}
.preserve-3d {
    transform-style: preserve-3d;
}
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    animation: marquee 30s linear infinite;
}
.animate-float {
    animation: float 3s ease-in-out infinite;
}
.section-padding {
    padding: 6rem 0;
}
.glass-dark {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px);
}
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
