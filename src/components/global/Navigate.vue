<template>
  <div class="container">
    <a-menu
      style="width: 200px;height:100%"
      :default-selected-keys="['1']"
      :open-keys.sync="openKeys"
      mode="inline"
      @click="handleClick"
    >
      <a-sub-menu key="sub1" @titleClick="titleClick">
        <span slot="title"><a-icon type="mail" /><span>流程</span></span>
        <a-menu-item key="checkin">
          窗口登记
        </a-menu-item>
        <a-menu-item key="sendout">
          项目派件
        </a-menu-item>
        <a-menu-item key="3">
          测绘承办
        </a-menu-item>
        <a-menu-item key="4">
          质量检查
        </a-menu-item>
        <a-menu-item key="5">
          成果审核
        </a-menu-item>
        <a-menu-item key="6">
          成果神品
        </a-menu-item>
        <a-menu-item key="7">
          核算收费
        </a-menu-item>
        <a-menu-item key="8">
          项目归档
        </a-menu-item>
        <a-menu-item key="contractmanagement">
          合同管理
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2" @titleClick="titleClick">
        <span slot="title"
          ><a-icon type="appstore" /><span>Navigation Two</span></span
        >
        <a-menu-item key="5">
          Option 5
        </a-menu-item>
        <a-menu-item key="6">
          Option 6
        </a-menu-item>
        <a-sub-menu key="sub3" title="Submenu">
          <a-menu-item key="7">
            Option 7
          </a-menu-item>
          <a-menu-item key="8">
            Option 8
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"
          ><a-icon type="setting" /><span>Navigation Three</span></span
        >
        <a-menu-item key="9">
          Option 9
        </a-menu-item>
        <a-menu-item key="10">
          Option 10
        </a-menu-item>
        <a-menu-item key="11">
          Option 11
        </a-menu-item>
        <a-menu-item key="12">
          Option 12
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import request from "@/utils/request";
import { Button } from "ant-design-vue";
Vue.use(Button);
export default {
  data() {
    return {
      current: ["mail"],
      openKeys: ["sub1"],
    };
  },
  watch: {
    openKeys(val) {
      console.log("openKeys", val);
    },
  },
  methods: {
    handleClick(e) {
      console.log("click", e);
      this.$emit("childFn", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    async clickrequest(e) {
      const users = await request.get("/cxch/role");
      console.log(users);
    },
  },
};
</script>
<style lang="scss">
.container {
  width: fit-content;
  height: 100%;
}
</style>
