import axios from "axios";

//创建拦截器
axios.interceptors.request.use(
  (config) => {
    //预处理一些请求信息
    //一般进行token设置
    const token = localStorage.getItem("token");
    token && (config.headers.Authorzation = token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//创建响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      //服务器状态码
      switch (response.status) {
        case 401: //权限不足
          break;
        case 403: //服务器拒绝执行 token或session过期
          break;
        case 404: //找不到地址
          break;
      }
    } else {
      //服务器未返回结果
      if (!window.navigator.onLine) {
        //客户端断网
      }
    }
  }
);
