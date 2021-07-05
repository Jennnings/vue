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
    <div style="margin-top:20px">
      <a-descriptions bordered :column="1">
        <a-descriptions-item
          v-for="item in moduleAuthority.modules"
          :key="item.ModuleID"
          :label="item.ModuleName"
          :span="1"
        >
          <div class="checkboxgroup">
            <div
              v-for="checkitem in item.Authority"
              :key="checkitem.AuthorityTag"
            >
              <a-checkbox
                :checked="checkitem.isAuthority"
                @click="checkedclick(checkitem)"
              >
                {{ checkitem.AuthorityName }}
              </a-checkbox>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelRoleAuthority">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmRoleAuthority">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
import qs from "qs";
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
      moduleAuthority: {},
      moduleType,
      roleName: "",
      selectedModuleType: "20",
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
    async getRoleAuthorityInfo(m_moduletypeid) {
      axios
        .get(GLOBAL.env + "/rolemanagement/getauthorityroleinfo", {
          params: {
            roleid: this.selecteditem,
            moduletypeid: m_moduletypeid,
          },
        })
        .then((res) => {
          this.moduleAuthority = res.data[0];
        });
    },
    selectModule(record) {
      this.selectedModuleType = record.key;
      this.getRoleAuthorityInfo(record.key);
    },
    cancelRoleAuthority() {},
    confirmRoleAuthority() {
      // console.log(qs.stringify(this.moduleAuthority));
      let postParams = new URLSearchParams();
      postParams.append("roleauthority", JSON.stringify(this.moduleAuthority));
      postParams.append("moduletypeid", this.selectedModuleType);
      postParams.append("roleid", this.selecteditem);
      axios
        .post(GLOBAL.env + "/rolemanagement/roleauthoritymodify", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("授权成功");
          } else {
            this.$message.error("授权失败");
          }
        });
    },
    checkedclick(checkitem) {
      checkitem.isAuthority = !checkitem.isAuthority;
    },
  },
  mounted: function() {
    this.getRoleAuthority();
    //默认选中流程中的权限
    this.getRoleAuthorityInfo(20);
  },
};
</script>
<style lang="scss">
.checkboxgroup {
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
}
.buttonGtoup {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  .singlebutton {
    margin-right: 10px;
  }
}
</style>
