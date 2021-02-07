<template>
  <div class="userInfoContianer">
    <el-dropdown @command="handleCommand">
      <a-avatar size="large">User</a-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  methods: {
    handleCommand(command) {
      if (command === "logOut") {
        sessionStorage.clear();
        this.$router.push('/')
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
