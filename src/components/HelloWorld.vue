<template>
  <div class="outerContainer">
    <div class="header">
      <div class="title">
        <span>
          昆山城乡房产测量有限公司 项目测绘信息管理系统
        </span>
      </div>
      <userInfo />
    </div>
    <div class="container">
      <div class="nav">
        <Navigate @childFn="parentFn" />
      </div>
      <div class="routeContainer">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Navigate from "@/components/global/Navigate.vue";
import userInfo from "@/components/global/userInfo.vue";
import router from "@/router";

export default {
  name: "helloworld",
  components: {
    Navigate,
    userInfo,
  },
  methods: {
    clickrequest(e) {
      this.$router.replace("/sendout");
    },
    parentFn(res) {
      console.log("alert", res.key);
      this.$router.replace(res.key);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.outerContainer {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  .header {
    height: 60px;
    width: 100%;
    background-color: #1890ff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title {
      color: white;
      font-size: 25px;
      font-weight: bold;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
  }
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    .nav {
      width: fit-content;
      height: 100%;
    }
    .routeContainer {
      height: 100%;
      width: 100%;
      overflow-y: auto;
    }
  }
}
</style>
