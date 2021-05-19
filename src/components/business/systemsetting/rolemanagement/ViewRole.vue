<template>
  <div>
    <a-spin :spinning="spinning">
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
    </a-spin>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
export default {
  props: ["selecteditem"],
  data() {
    return {
      roleName: "",
      disableEdit: true,
      roleOrder: "",
      roleDescription: "",
      spinning: false,
    };
  },
  methods: {
    async getRoleInfo() {
      this.spinning = true;
      const tmp_data = await request.get(
        GLOBAL.env + "/rolemanagement/viewrole",
        {
          params: {
            roleid: this.selecteditem,
          },
        }
      );
      this.roleName = tmp_data.data[0].rolename;
      this.roleOrder = tmp_data.data[0].roleorder;
      this.roleDescription = tmp_data.data[0].roledescription;
      this.spinning = false;
    },
  },
  mounted: function() {
    this.getRoleInfo();
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
