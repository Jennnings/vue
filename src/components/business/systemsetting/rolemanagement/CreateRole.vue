<template>
  <div>
    <div class="projectInfo">
      <a-descriptions :column="1" bordered size="small">
        <a-descriptions-item label="角色名称" :span="1">
          <a-badge dot>
            <a-input
              placeholder="角色名称"
              :disabled="disableEdit"
              v-model="roleName"
            >
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="角色排序" :span="1">
          <a-badge dot>
            <a-input
              placeholder="角色排序"
              :disabled="disableEdit"
              v-model="roleOrder"
            >
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="角色说明" :span="1">
          <a-input
            placeholder="角色说明"
            :disabled="disableEdit"
            v-model="roleDescription"
          >
          </a-input>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelCreateRole">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmCreateRole">
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
export default {
  data() {
    return {
      roleName: "",
      disableEdit: false,
      roleOrder: "",
      roleDescription: "",
    };
  },
  methods: {
    cancelCreateRole() {
      this.$emit("cancelCreateRole");
    },
    confirmCreateRole() {
      if (this.roleName == "") {
        this.$message.warning("请输入角色名称");
        return;
      }
      if (this.roleOrder == "") {
        this.$message.warning("请输入角色排序");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("rolename", this.roleName);
      postParams.append("roleorder", this.roleOrder);
      postParams.append("roledescription", this.roleDescription);
      axios
        .post(GLOBAL.env + "/rolemanagement/createrole", postParams)
        .then((res) => {
          if (res.data === "existedorder") {
            this.$message.error("排序已经存在");
          } else if (res.data == "success") {
            this.$message.success("创建角色成功");
            this.$emit("createrolesuccess");
            //关闭此窗口代码
          } else {
            this.$message.error("创建角色失败");
          }
        });
    },
  },
};
</script>
<style lang="scss">
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small
  .ant-descriptions-item-content {
  padding: 4px 17px;
  //user-select: none;
}
.ant-modal-body {
  padding-top: 12px;
}
.ant-descriptions-title {
  margin-bottom: 10px;
}
.ant-modal-header {
  padding: 10px 24px;
}
.ant-badge {
  width: 100%;
}
.supportMaterials {
  width: 1110px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
