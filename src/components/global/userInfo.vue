<template>
  <div class="userInfoContianer">
    <a-dropdown>
      <a-avatar size="large">{{ userInfo }}</a-avatar>
      <a-menu slot="overlay" @click="handleCommand">
        <a-menu-item key="logOut">退出</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
    };
  },
  methods: {
    handleCommand(e) {
      console.log(e);
      if (e.key === "logOut") {
        sessionStorage.clear();
        this.$router.push("/");
      }
    },
  },
  mounted: function() {
    //解决在路由history模式下
    //未登录直接在地址栏输入地址路由守卫不生效 无法转跳至登录页面问题
    //hash模式未测试，hash模式#前文字问题
    if (!sessionStorage.getItem("userInfo")) {
      this.$router.push("/");
    } else {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo")).userName;
    }
  },
};
</script>
<style lang="scss">
.userInfoContianer {
  margin-right: 50px;
  :hover {
    cursor: pointer;
  }
}
</style>
