import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import ProductPage from './views/Product.vue'
import BasketPage from './views/Basket.vue'
import NotFound from './views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/product/:id',
      component: ProductPage
    },
    {
      path: '/basket',
      component: BasketPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

export default router