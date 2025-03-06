import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/pages/index.vue"),
  },
  {
    path: "/:id",
    name: "detail",
    component: () => import(/* webpackChunkName: "detail" */ "@/pages/[id].vue"),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
