import axios from "axios";
import store from "@/store";
import NProgress from "nprogress";
import Global from "./global_variable";
const VUE_APP_BASE_URL_GET = "http://192.168.18.38:66";
const VUE_APP_BASE_URL_HOME = "http://192.168.0.101:66";
const VUE_APP_BASE_URL = "http://127.0.0.1:8000";
NProgress.configure({ showSpinner: false });
const request = axios.create({
  baseURL: Global.env,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//请求拦截器
//认证token时候
request.interceptors.request.use(
  (config) => {
    // config.headers['token']=store.state.token
    NProgress.start();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
request.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default request;
