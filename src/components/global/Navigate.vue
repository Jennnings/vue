<template>
  <div class="container">
    <a-spin :spinning="spinning">
      <!--:open-keys="openKeys" @openChange="onOpenChange"-->
      <a-menu
        style="width: 200px;height:100%"
        :defaultSelectedKeys="current"
        mode="inline"
        @click="handleClick"
      >
        <a-menu-item key="guidepage">
          <a-icon type="home" />
          <span>首页</span>
        </a-menu-item>
        <a-sub-menu
          v-for="items in menu"
          :key="items.order"
          @titleClick="titleClick"
        >
          <span slot="title" v-if="items.index == 19">
            <a-icon type="mail" /><span>{{ items.name }}</span>
          </span>
          <span slot="title" v-if="items.index == 2">
            <a-icon type="appstore" /><span>{{ items.name }}</span>
          </span>
          <span slot="title" v-if="items.index == 1">
            <a-icon type="setting" /><span>{{ items.name }}</span>
          </span>
          <a-menu-item v-for="submenu in items.children" :key="submenu.url">
            {{ submenu.name }}
          </a-menu-item>
        </a-sub-menu>
        <!-- <a-sub-menu key="sub1" @titleClick="titleClick">
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
      <a-sub-menu key="sub2">
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
      </a-sub-menu> -->
      </a-menu>
    </a-spin>
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
      openKeys: [20],
      rootSubmenuKeys: [],
      defaultSelect: [],
      menu: [],
      spinning: false,
    };
  },
  watch: {
    openKeys(val) {},
  },
  methods: {
    async getMenuList() {
      this.spinning = true;
      const tmp_menu = await request("/common/getmenulist", {
        params: {
          userid: JSON.parse(sessionStorage.getItem("userToken")).UserID,
        },
      });
      console.log(tmp_menu);
      function sortChildIndex(a, b) {
        return a.childIndex - b.childIndex;
      }
      tmp_menu.data.forEach((element) => {
        element.children = element.children.sort(sortChildIndex);
        this.rootSubmenuKeys.push(element.order);
      });
      this.menu = tmp_menu.data;
      this.$store.state.menuAuthority = tmp_menu.data;

      this.spinning = false;
    },
    handleClick(e) {
      console.log(e);
      if (e.key.indexOf("aspx") == -1) {
        this.$emit("childFn", e);
      } else {
        this.$message.warning("即将上线");
      }
    },
    titleClick(e) {
      //console.log(this.openKeys);
    },
    onOpenChange(openKeys) {
      console.log(openKeys);
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
  mounted: function() {
    this.getMenuList();
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
