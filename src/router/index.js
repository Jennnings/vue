import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    redirect: "login",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "home/checkin",
    children: [
      {
        path: "checkin",
        name: "FlowCheckIn",
        component: () =>
          import("../components/business/businessflow/FlowWindowCheckin.vue"),
      },
      {
        path: "sendout",
        name: "FlowWindowProjectSendOut",
        component: () =>
          import(
            "../components/business/businessflow/FlowWindowProjectSendOut.vue"
          ),
      },
      {
        path: "mappingundertaking",
        name: "mappingundertaking",
        component: () =>
          import(
            "../components/business/businessflow/FlowWindowMappingUndertaking.vue"
          ),
      },
      {
        path: "qualitycheck",
        name: "qualitycheck",
        component: () =>
          import(
            "../components/business/businessflow/FlowWindowQualityCheck.vue"
          ),
      },
      {
        path: "contractmanagement",
        name: "FlowWindowContract",
        component: () =>
          import("../components/business/businessflow/FlowWindowContract.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "login_name",
    component: () => import("../components/global/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
