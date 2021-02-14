<template>
  <a-config-provider :locale="zh_CN">
    <div class="app">
      <router-view />
    </div>
  </a-config-provider>
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
}
</style>
