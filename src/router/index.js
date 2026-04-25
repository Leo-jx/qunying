import { createRouter, createWebHistory } from 'vue-router'
import PortalHome from '@/views/PortalHome.vue'

const routes = [
  { path: '/', name: 'portal', component: PortalHome },
  {
    path: '/public',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', redirect: '/public/apply' },
      { path: 'apply', name: 'public-apply', component: () => import('@/views/public/DisputeApply.vue') },
      { path: 'open', name: 'public-open', component: () => import('@/views/public/OpenSupervision.vue') },
      { path: 'mine', name: 'public-mine', component: () => import('@/views/public/MyDisputes.vue') },
      { path: 'legal', name: 'public-legal', component: () => import('@/views/public/LegalConsult.vue') },
    ],
  },
  {
    path: '/qunying',
    component: () => import('@/layouts/QunyingLayout.vue'),
    children: [
      { path: '', redirect: '/qunying/inbox' },
      { path: 'inbox', name: 'qy-inbox', component: () => import('@/views/qunying/Inbox.vue') },
      { path: 'bench', name: 'qy-bench', component: () => import('@/views/qunying/MediationBench.vue') },
      { path: 'library', name: 'qy-library', component: () => import('@/views/qunying/LawLibrary.vue') },
      { path: 'publish', name: 'qy-publish', component: () => import('@/views/qunying/ResultPublish.vue') },
      { path: 'learn', name: 'qy-learn', component: () => import('@/views/qunying/LawSchool.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'ad-dash', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'justice', name: 'ad-justice', component: () => import('@/views/admin/JusticeLink.vue') },
      { path: 'guide', name: 'ad-guide', component: () => import('@/views/admin/LegalGuide.vue') },
      { path: 'stats', name: 'ad-stats', component: () => import('@/views/admin/Statistics.vue') },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
