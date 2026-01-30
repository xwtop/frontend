import { createRouter, createWebHistory } from 'vue-router'
import Land from '../views/Land.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import User from '../views/system/User.vue'
import Role from '../views/system/Role.vue'
import Permission from '../views/system/Permission.vue'
import Log from '../views/system/Log.vue'
import Profile from '../views/profile/Profile.vue'
import Preferences from '../views/profile/Preferences.vue'
import Security from '../views/profile/Security.vue'
import Subscription from '../views/profile/Subscription.vue'
import ArticlePublish from '../views/content/ArticlePublish.vue'
import ArticleList from '../views/content/ArticleList.vue'
import CategoryManage from '../views/content/CategoryManage.vue'
import TopManage from '../views/content/TopManage.vue'
import ExpiredManage from '../views/content/ExpiredManage.vue'
import Category from '../views/content/Category.vue'
import Search from '../views/content/Search.vue'
import Rank from '../views/content/Rank.vue'
import Favorites from '../views/content/Favorites.vue'
import Interaction from '../views/interaction/Interaction.vue'
import Feedback from '../views/interaction/Feedback.vue'
import Message from '../views/notification/Message.vue'
import Reminder from '../views/notification/Reminder.vue'
import Broadcast from '../views/notification/Broadcast.vue'

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
                path: 'profile/preferences',
                name: 'Preferences',
                component: Preferences,
                meta: { title: '偏好设置', icon: 'Setting' }
            },
            {
                path: 'profile/security',
                name: 'Security',
                component: Security,
                meta: { title: '安全中心', icon: 'Lock' }
            },
            {
                path: 'profile/subscription',
                name: 'Subscription',
                component: Subscription,
                meta: { title: '订阅管理', icon: 'Bell' }
            },

            {
                path: 'content/top',
                name: 'ContentTop',
                component: TopManage,
                meta: { title: '置顶管理', icon: 'Top', requiresAdmin: true }
            },
            {
                path: 'content/expired',
                name: 'ContentExpired',
                component: ExpiredManage,
                meta: { title: '过期内容', icon: 'Clock', requiresAdmin: true }
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
                path: 'content/favorites',
                name: 'ContentFavorites',
                component: Favorites,
                meta: { title: '我的收藏', icon: 'Star' }
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
                path: 'content-center/favorites',
                name: 'ContentCenterFavorites',
                component: Favorites,
                meta: { title: '我的收藏', icon: 'Star' }
            },
            {
                path: 'content/article-pub',
                name: 'ArticlePublish',
                component: ArticlePublish,
                meta: { title: '发布文章', icon: 'Edit', requiresAdmin: true }
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
                path: 'interaction/interaction',
                name: 'Interaction',
                component: Interaction,
                meta: { title: '内容互动', icon: 'ChatDotRound' }
            },
            {
                path: 'interaction/feedback',
                name: 'Feedback',
                component: Feedback,
                meta: { title: '意见反馈', icon: 'ChatLineRound' }
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
                meta: { title: '角色权限', icon: 'Key', requiresAdmin: true }
            },
            {
                path: 'system/permission',
                name: 'Permission',
                component: Permission,
                meta: { title: '权限管理', icon: 'Lock', requiresAdmin: true }
            },
            {
                path: 'system/log',
                name: 'Log',
                component: Log,
                meta: { title: '日志审计', icon: 'Document', requiresAdmin: true }
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
            {
                path: 'notification/broadcast',
                name: 'NotificationBroadcast',
                component: Broadcast,
                meta: { title: '群发设置', icon: 'Promotion', requiresAdmin: true }
            }
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
