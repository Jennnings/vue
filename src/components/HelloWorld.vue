<template>
  <div class="container">
    <!-- <a-button type="primary" @click="clickrequest">
      Primary
    </a-button> -->
    <div class="nav">
      <Navigate @childFn="parentFn" />
    </div>
    <div class="routeContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Navigate from "@/components/global/Navigate.vue";
import router from "@/router";

export default {
  name: "helloworld",
  components: {
    Navigate,
  },
  methods: {
    clickrequest(e) {
      this.$router.replace("sendout");
    },
    parentFn(res) {
      console.log("alert", res);
      this.$router.replace(res.key);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
  }
}
</style>
