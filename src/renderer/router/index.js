import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Home = (resolve) => {
  import('@/components/LandingPage').then((module) => {
    resolve(module)
  })
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
