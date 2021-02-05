<template>
  <div class="app">
    <div class="header"></div>
    <div class="content">
      <router-link to="/"></router-link>
      <router-view />
    </div>
  </div>
</template>
<script></script>

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
