<template>
  <div class="container">
    <a-menu
      style="width: 200px;height:100%"
      :open-keys="openKeys"
      :defaultSelectedKeys="current"
      mode="inline"
      @openChange="onOpenChange"
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
        <a-menu-item key="mappingundertaking">
          测绘承办
        </a-menu-item>
        <a-menu-item key="qualitycheck">
          质量检查
        </a-menu-item>
        <a-menu-item key="resultcheck">
          成果审核
        </a-menu-item>
        <a-menu-item key="resultapprovement">
          成果审批
        </a-menu-item>
        <a-menu-item key="calculateexpense">
          核算收费
        </a-menu-item>
        <a-menu-item key="recordproject">
          项目归档
        </a-menu-item>
        <a-menu-item key="contractmanagement">
          合同管理
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2" @titleClick="titleClick">
        <span slot="title"><a-icon type="appstore" /><span>查询</span></span>
        <a-menu-item key="5">
          综合查询
        </a-menu-item>
        <a-menu-item key="6">
          项目统计
        </a-menu-item>
        <a-menu-item key="7">
          机构管理
        </a-menu-item>
        <a-menu-item key="22">
          财务统计
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"><a-icon type="setting" /><span>设置</span></span>
        <a-menu-item key="9">
          机构管理
        </a-menu-item>
        <a-menu-item key="10">
          角色管理
        </a-menu-item>
        <a-menu-item key="11">
          用户管理
        </a-menu-item>
        <a-menu-item key="12">
          菜单管理
        </a-menu-item>
        <a-menu-item key="13">
          操作列表
        </a-menu-item>
        <a-menu-item key="14">
          系统日志
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
      current: [],
      openKeys: ["sub1"],
      rootSubmenuKeys: ["sub1", "sub2", "sub4"],
      defaultSelect: [],
    };
  },
  watch: {
    openKeys(val) {},
  },
  methods: {
    handleClick(e) {
      this.$emit("childFn", e);
    },
    titleClick(e) {
      console.log(this.openKeys);
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    async clickrequest(e) {
      const users = await request.get("/cxch/role");
    },
  },
  created: function() {
    const arr = window.location.href.split("/");
    this.defaultSelect.push(arr[arr.length - 1]);
    this.current = [arr[arr.length - 1]];
  },
};
</script>
<style lang="scss">
.container {
  width: fit-content;
  height: 100%;
}
</style>
