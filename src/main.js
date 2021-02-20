import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from "vue-router";
import store from "./store";
import "./assets/styles/styles.scss";
import Antd from "ant-design-vue"; // 引入Ant Design Vue组件
import "ant-design-vue/dist/antd.css"; // 引入Ant Design Vue样式
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import moment from "moment";

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;
Vue.use(Antd);

// Vue.use(ElementUI);
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};

//replace
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  if (to.name === "login" || from.path === "/" || to.name === "login_name") {
    next();
  } else {
    let userToken = sessionStorage.getItem("userToken");
    console.log("userToken", userToken);
    if (userToken === null || userToken === "") {
      next({ path: "/" });
    } else {
      next();
    }
  }
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
