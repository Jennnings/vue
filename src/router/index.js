import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      console.log("go home2");
      // if (!sessionStorage.getItem("key")) {
      next();
      // } else {
      //   //转跳login
      //   // next('/about')
      // }
    },
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
