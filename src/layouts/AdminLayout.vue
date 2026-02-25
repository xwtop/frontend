<template>
    <div class="admin-layout h-screen flex flex-col bg-slate-50">
        <div class="flex flex-1 overflow-hidden">
            <aside
                :class="['bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden', isCollapse ? 'w-16' : 'w-40']"
            >
                <div class="h-16 flex items-center justify-center border-b border-slate-700">
                    <div v-if="!isCollapse" class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span class="font-bold text-white">智</span>
                        </div>
                        <span class="font-bold text-lg">校园智通</span>
                    </div>
                    <div v-else class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                        <span class="font-bold text-white">智</span>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto py-4 hide-scrollbar">
                    <el-menu
                        :default-active="activeMenu"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        background-color="#0f172a"
                        text-color="#94a3b8"
                        active-text-color="#3b82f6"
                        @select="handleMenuSelect"
                    >
                        <template v-for="menu in menuList" :key="menu.path">
                            <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
                                <template #title>
                                    <component :is="menu.icon" class="w-5 h-5" />
                                    <span>{{ menu.title }}</span>
                                </template>
                                <el-menu-item
                                    v-for="child in menu.children"
                                    :key="child.path"
                                    :index="child.path"
                                >
                                    <span>{{ child.title }}</span>
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="menu.path">
                                <component :is="menu.icon" class="w-5 h-5" />
                                <span>{{ menu.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </aside>

            <div class="flex-1 flex flex-col overflow-hidden">
                <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <div class="flex items-center gap-4">
                        <el-button
                            :icon="isCollapse ? Expand : Fold"
                            circle
                            @click="isCollapse = !isCollapse"
                        />
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
                                {{ item.title }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="cursor-pointer">
                            <el-button :icon="Bell" circle @click="handleNotificationClick" />
                        </el-badge>
                        <el-dropdown>
                            <div class="flex items-center gap-2 cursor-pointer">
                                <el-avatar 
                                    :size="32" 
                                    :src="userInfo.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20placeholder&image_size=square'"
                                    class="bg-primary-600"
                                >
                                    {{ !userInfo.avatar && (userInfo.realName?.charAt(0) || '用') }}
                                </el-avatar>
                                <span class="text-slate-700 font-medium">{{ userInfo.realName || '用户' }}</span>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>个人中心</el-dropdown-item>
                                    <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </header>

                <div class="flex-1 flex flex-col overflow-hidden">
                    <div class="bg-white border-b border-slate-200 px-4">
                        <el-tabs
                            v-model="activeTab"
                            type="card"
                            closable
                            @tab-remove="handleTabRemove"
                            @tab-click="handleTabClick"
                        >
                            <el-tab-pane
                                v-for="tab in tabList"
                                :key="tab.path"
                                :label="tab.title"
                                :name="tab.path"
                            />
                        </el-tabs>
                    </div>

                    <main class="flex-1 overflow-y-auto p-2">
                        <router-view v-slot="{ Component }">
                            <transition name="fade" mode="out-in">
                                <component :is="Component" />
                            </transition>
                        </router-view>
                    </main>
                </div>
            </div>
        </div>

        <NotificationPanel
            v-model:visible="showNotificationPanel"
            @refresh="loadUnreadCount"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch, markRaw, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
    Expand,
    Fold,
    Bell,
    HomeFilled,
    User,
    Setting,
    Lock,
    Document,
    FolderOpened,
    Grid,
    Search,
    Star,
    TrendCharts,
    ChatDotRound,
    ChatLineRound,
    Message,
    AlarmClock,
    Promotion,
    Top,
    Clock
} from '@element-plus/icons-vue'
import { Heart } from 'lucide-vue-next'
import NotificationPanel from '@/components/NotificationPanel.vue'
import { notificationAPI } from '@/api/notification'
import { userAPI } from '@/api/user'
import socketService from '@/services/socket'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const activeTab = ref(route.path)
const activeMenu = ref(route.path)
const unreadCount = ref(0)
const showNotificationPanel = ref(false)

const userInfo = ref({
    realName: '',
    avatar: ''
})

const loadUserInfo = async () => {
    try {
        const userInfoStr = localStorage.getItem('userInfo')
        if (!userInfoStr) {
            return
        }
        const userInfoData = JSON.parse(userInfoStr)
        const userId = userInfoData.userId
        if (!userId) {
            return
        }
        const res = await userAPI.getById(userId)
        const userData = res.data
        userInfo.value = {
            realName: userData.realName || '',
            avatar: userData.avatar || ''
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
    }
}

const menuList = ref([
    {
        path: '/admin/dashboard',
        title: '首页',
        icon: markRaw(HomeFilled)
    },
    {
        path: '/admin/profile',
        title: '个人中心',
        icon: markRaw(User),
        children: [
            {
                path: '/admin/profile/profile',
                title: '个人档案',
                icon: markRaw(User)
            },
            {
                path: '/admin/profile/subscription',
                title: '订阅管理',
                icon: markRaw(Bell)
            },
            {
                path: '/admin/profile/likes',
                title: '我的点赞',
                icon: markRaw(Heart)
            }
        ]
    },
    {
                path: '/admin/content-center',
                title: '内容中心',
                icon: markRaw(Grid),
                children: [
                    {
                        path: '/admin/content/article-list',
                        title: '文章管理',
                        icon: markRaw(Document)
                    },
                    {
                        path: '/admin/content/category-manage',
                        title: '分类管理',
                        icon: markRaw(FolderOpened)
                    },
                    {
                        path: '/admin/content-center/category',
                        title: '分类浏览',
                        icon: markRaw(Grid)
                    },
                    {
                        path: '/admin/content-center/search',
                        title: '智能检索',
                        icon: markRaw(Search)
                    },
                    {
                        path: '/admin/content-center/rank',
                        title: '热榜排行',
                        icon: markRaw(TrendCharts)
                    },
                    {
                        path: '/admin/content-center/recommendation',
                        title: '个性推荐',
                        icon: markRaw(Promotion)
                    }
                ]
            },
    {
        path: '/admin/system',
        title: '系统管理',
        icon: markRaw(Setting),
        children: [
            {
                path: '/admin/system/user',
                title: '用户管理',
                icon: markRaw(User)
            },
            {
                path: '/admin/system/role',
                title: '角色管理',
                icon: markRaw(Lock)
            },
            {
                path: '/admin/system/permission',
                title: '权限管理',
                icon: markRaw(Lock)
            }
        ]
    },
    {
        path: '/admin/notification',
        title: '通知中心',
        icon: markRaw(Message),
        children: [
            {
                path: '/admin/notification/message',
                title: '消息通知',
                icon: markRaw(Message)
            },
            {
                path: '/admin/notification/reminder',
                title: '定时提醒',
                icon: markRaw(AlarmClock)
            }
        ]
    }
])

const tabList = ref([
    {
        path: '/admin/dashboard',
        title: '工作台'
    }
])

const breadcrumbList = computed(() => {
    const list = []
    const path = route.path
    
    menuList.value.forEach(menu => {
        if (menu.path === path) {
            list.push({ path: menu.path, title: menu.title })
        } else if (menu.children) {
            menu.children.forEach(child => {
                if (child.path === path) {
                    list.push({ path: menu.path, title: menu.title })
                    list.push({ path: child.path, title: child.title })
                }
            })
        }
    })
    
    if (list.length === 0) {
        list.push({ path: path, title: '首页' })
    }
    
    return list
})

watch(() => route.path, (newPath) => {
    activeTab.value = newPath
    activeMenu.value = newPath
    
    if (newPath === '/admin/notification/message') {
        loadUnreadCount()
    }
    
    const exists = tabList.value.find(tab => tab.path === newPath)
    if (!exists) {
        const menuItem = findMenuItem(newPath)
        if (menuItem) {
            tabList.value.push({ path: newPath, title: menuItem.title })
        }
    }
})

const findMenuItem = (path) => {
    for (const menu of menuList.value) {
        if (menu.path === path) {
            return menu
        }
        if (menu.children) {
            const child = menu.children.find(c => c.path === path)
            if (child) {
                return child
            }
        }
    }
    return null
}

const handleMenuSelect = (path) => {
    router.push(path)
}

const handleTabRemove = (path) => {
    if (tabList.value.length === 1) {
        ElMessage.warning('至少保留一个标签页')
        return
    }
    
    const index = tabList.value.findIndex(tab => tab.path === path)
    tabList.value.splice(index, 1)
    
    if (activeTab.value === path) {
        const nextTab = tabList.value[index - 1] || tabList.value[0]
        activeTab.value = nextTab.path
        router.push(nextTab.path)
    }
}

const handleTabClick = (tab) => {
    router.push(tab.paneName)
}

const loadUnreadCount = async () => {
    try {
        const result = await notificationAPI.unreadCount()
        unreadCount.value = result.data.count || 0
    } catch (error) {
        console.error('加载未读通知数量失败', error)
    }
}

const handleNewNotification = (notification) => {
    console.log('[AdminLayout] 收到新通知事件:', notification)
    unreadCount.value++
    console.log('[AdminLayout] 未读数量更新为:', unreadCount.value)
    ElNotification({
        title: notification.title,
        message: notification.content,
        position: 'bottom-right',
        duration: 4500,
        type: 'success',
        showClose: true
    })
}

onMounted(() => {
    loadUnreadCount()
    loadUserInfo()
    
    // 检查当前路由路径是否在标签列表中，如果不在，添加对应的标签
    const currentPath = route.path
    const exists = tabList.value.find(tab => tab.path === currentPath)
    if (!exists) {
        const menuItem = findMenuItem(currentPath)
        if (menuItem) {
            tabList.value = [
                { path: currentPath, title: menuItem.title }
            ]
        }
    }
    
    const token = localStorage.getItem('token')
    if (token) {
        socketService.connect(token)
        socketService.on('new_notification', handleNewNotification)
    }
})

onUnmounted(() => {
    socketService.off('new_notification', handleNewNotification)
})

const handleLogout = () => {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        socketService.disconnect()
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        ElMessage.success('退出成功')
        router.push('/login')
    }).catch(() => {})
}

const handleNotificationClick = () => {
    router.push('/admin/notification/message')
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
