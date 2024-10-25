import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import TestPage from '../views/TestPage.vue';
import ResultPage from '../views/ResultPage.vue';
import AccountPage from '../views/AccountPage.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/test/:billetId',
    name: 'TestPage',
    component: TestPage
  },
  {
    path: '/results',
    name: 'ResultPage',
    component: ResultPage
  },
  {
    path: '/account',
    name: 'AccountPage',
    component: AccountPage
  }


];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login'); 
  } else {
    next();
  }
});


export default router;
