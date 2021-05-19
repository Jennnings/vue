<template>
  <div>
    <span>{{ roleName }}</span>
    <a-select
      style="width: 150px;margin-left:20px"
      placeholder="模块名称"
      label-in-value
      :default-value="{ key: '20' }"
      @change="selectModule"
    >
      <a-select-option v-for="item in moduleType" :key="item.moduleid">
        {{ item.modulename }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
const moduleType = [
  {
    moduleid: "3",
    modulename: "查询",
  },
  {
    moduleid: "4",
    modulename: "设置",
  },
  {
    moduleid: "20",
    modulename: "流程",
  },
];
export default {
  props: ["selecteditem"],
  data() {
    return {
      moduleType,
      roleName: "",
    };
  },
  methods: {
    async getRoleAuthority() {
      axios
        .get(GLOBAL.env + "/rolemanagement/viewrole", {
          params: {
            roleid: this.selecteditem,
          },
        })
        .then((res) => {
          this.roleName = res.data[0].rolename;
        });
    },
    selectModule(record) {
      console.log(record);
    },
  },
  mounted: function() {
    this.getRoleAuthority();
  },
};
</script>
<style lang="scss"></style>
