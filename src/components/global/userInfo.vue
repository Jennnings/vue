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
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")).userName,
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
