import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Admin from '@/components/Admin.vue'
import MyHome from '@/components/MyHome.vue'
import Login from '@/components/Login.vue'
import Brands from '@/components/Brands.vue'
import Products from '@/components/Products.vue'
import Uploads from '@/components/Upload.vue'
import Chats from '@/components/Chats.vue'
import Market from '@/components/Market.vue'
import Comments from '@/components/ProductComments.vue'
import Viewer from '@/components/Productviewer.vue'
import Cart from '@/components/ViewCart.vue'
import Searched from '@/components/Searched.vue'
import Notifier from '@/components/Notifier.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/myHome',
    name: 'MyHome',
    component: MyHome
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/brands',
    name: 'Brands',
    component: Brands
  },
  {
    path: '/products/:userId',
    name: 'Products',
    component: Products,
    props: true
  },
  {
    path: '/uploads',
    name: 'Upload',
    component: Uploads,
    props: true
  },
  {
    path: '/chats',
    name: 'Chats',
    component: Chats,
    props : true
  },
  {
    path: '/notifier',
    name: 'Notifier',
    component: Notifier,
    props : true
  },
  {
    path: '/market',
    name: 'Market',
    component: Market
  },
  {
    path: '/comments',
    name: 'ProductComments',
    component: Comments,
    props:true
  },
  {
    path: '/viewer',
    name: 'Productviewer',
    component: Viewer,
    props : true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    props : true
  },
  {
    path: '/searched',
    name: 'Searched',
    component: Searched,
    props : true
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
