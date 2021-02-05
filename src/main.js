import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/styles/styles.scss";
import Antd from "ant-design-vue"; // 引入Ant Design Vue组件
import "ant-design-vue/dist/antd.css"; // 引入Ant Design Vue样式
Vue.config.productionTip = false;
Vue.use(Antd);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
