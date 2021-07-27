const file_path = "http://127.0.0.1:8000/cxch/uploadfile";
const env_dev = "http://127.0.0.1:8000";
const env_home = "http://192.168.0.101:66";
const env_company = "http://192.168.18.38:66";
const env_company_file = "http://192.168.18.38:67";
const env_online = "http://192.168.1.107:66";
const env_online_file = "http://192.168.1.107:67";
//在线系统文件上传时使用67端口 解决IIS对上传文件大小限制
// const env = env_online;
// const env_file = env_online_file;
const env = env_dev;
const env_file = env_dev;
export default {
  file_path,
  env,
  env_file,
};
