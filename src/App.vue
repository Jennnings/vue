<template>
  <a-locale-provider :locale="zh_CN">
    <div class="app">
      <div class="header"></div>
      <div class="content">
        <router-link to="/"></router-link>
        <router-view />
      </div>
    </div>
  </a-locale-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      zh_CN
    };
  }
};
</script>

<style lang="scss">
.app {
  height: 100%;
  margin: 0;
  padding: 0;
  .header {
    height: 60px;
    width: 100%;
    background-color: rgb(20, 55, 122);
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
