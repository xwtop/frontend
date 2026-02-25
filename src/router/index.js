import { createRouter, createWebHistory } from 'vue-router'
import Land from '../views/Land.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import User from '../views/system/User.vue'
import Role from '../views/system/Role.vue'
import Permission from '../views/system/Permission.vue'
import Profile from '../views/profile/Profile.vue'
import SubscriptionManage from '../views/profile/SubscriptionManage.vue'
import ArticleList from '../views/content/ArticleList.vue'
import CategoryManage from '../views/content/CategoryManage.vue'
import Category from '../views/content/Category.vue'
import Search from '../views/content/Search.vue'
import Rank from '../views/content/Rank.vue'

import MyLikes from '../views/profile/MyLikes.vue'
import Message from '../views/notification/Message.vue'
import Reminder from '../views/notification/Reminder.vue'

const routes = [
    {
        path: '/',
        name: 'Land',
        component: Land
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/admin',
        component: AdminLayout,
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { title: '首页', icon: 'HomeFilled' }
            },
            {
                path: 'profile/profile',
                name: 'Profile',
                component: Profile,
                meta: { title: '个人档案', icon: 'User' }
            },
            {
                path: 'profile/subscription',
                name: 'Subscription',
                component: SubscriptionManage,
                meta: { title: '订阅管理', icon: 'Bell' }
            },
            {
                path: 'profile/likes',
                name: 'ProfileLikes',
                component: MyLikes,
                meta: { title: '我的点赞', icon: 'Heart' }
            },



            {
                path: 'content/category',
                name: 'ContentCategory',
                component: Category,
                meta: { title: '分类浏览', icon: 'Grid' }
            },
            {
                path: 'content/search',
                name: 'ContentSearch',
                component: Search,
                meta: { title: '智能检索', icon: 'Search' }
            },
            {
                path: 'content/rank',
                name: 'ContentRank',
                component: Rank,
                meta: { title: '热榜排行', icon: 'TrendCharts' }
            },

            {
                path: 'content-center/category',
                name: 'ContentCenterCategory',
                component: Category,
                meta: { title: '分类浏览', icon: 'Grid' }
            },
            {
                path: 'content-center/search',
                name: 'ContentCenterSearch',
                component: Search,
                meta: { title: '智能检索', icon: 'Search' }
            },
            {
                path: 'content-center/rank',
                name: 'ContentCenterRank',
                component: Rank,
                meta: { title: '热榜排行', icon: 'TrendCharts' }
            },
            {
                path: 'content-center/recommendation',
                name: 'ContentCenterRecommendation',
                component: () => import('../views/content/Recommendation.vue'),
                meta: { title: '个性推荐', icon: 'MagicStick' }
            },


            {
                path: 'content/article-list',
                name: 'ArticleList',
                component: ArticleList,
                meta: { title: '文章管理', icon: 'Document', requiresAdmin: true }
            },
            {
                path: 'content/category-manage',
                name: 'CategoryManage',
                component: CategoryManage,
                meta: { title: '分类管理', icon: 'FolderOpened', requiresAdmin: true }
            },
            {
                path: 'system/user',
                name: 'User',
                component: User,
                meta: { title: '用户管理', icon: 'UserFilled', requiresAdmin: true }
            },
            {
                path: 'system/role',
                name: 'Role',
                component: Role,
                meta: { title: '角色管理', icon: 'Key', requiresAdmin: true }
            },
            {
                path: 'system/permission',
                name: 'Permission',
                component: Permission,
                meta: { title: '权限管理', icon: 'Lock', requiresAdmin: true }
            },

            {
                path: 'notification/message',
                name: 'NotificationMessage',
                component: Message,
                meta: { title: '消息通知', icon: 'Message' }
            },
            {
                path: 'notification/reminder',
                name: 'NotificationReminder',
                component: Reminder,
                meta: { title: '定时提醒', icon: 'AlarmClock' }
            },

        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    
    if (to.path.startsWith('/admin') && !token) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && token) {
        next('/admin/dashboard')
    } else {
        next()
    }
})

export default router
