<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="用户名" :span="2">
            <a-badge dot>
              <a-input placeholder="用户名" v-model="userName" disabled>
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="密码" :span="1">
          <a-badge dot>
            <a-input-password placeholder="密码" v-model="userPassword">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input-password>
          </a-badge>
        </a-descriptions-item> -->
          <a-descriptions-item label="邮箱" :span="2">
            <a-input placeholder="邮箱" v-model="userEMail" disabled> </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="单位" :span="1">
            <a-badge dot>
              <a-input placeholder="单位" v-model="userCompany" disabled>
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="姓名" :span="1">
            <a-badge dot>
              <a-input placeholder="姓名" v-model="userLinkMan" disabled>
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="电话" :span="1">
            <a-input placeholder="电话" v-model="userLinkManPhone" disabled>
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="手机" :span="1">
            <a-badge dot>
              <a-input placeholder="手机" v-model="userLinkManMBPhone" disabled>
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="角色" :span="2">
            <a-checkbox-group disabled :value="userRole">
              <div class="supportMaterials">
                <div v-for="data in roledata" :key="data.roleid">
                  <a-checkbox :value="data.roleid">
                    {{ data.rolename }}
                  </a-checkbox>
                </div>
              </div>
            </a-checkbox-group>
          </a-descriptions-item>
          <a-descriptions-item label="组织" :span="1">
            <a-checkbox disabled :checked="organizationChecked">
              昆山市城乡房产测量有限公司
            </a-checkbox>
          </a-descriptions-item>
          <a-descriptions-item label="状态" :span="1">
            <a-input v-model="selectedtStatus" disabled></a-input>
            <!-- <a-select
              style="width: 200px"
              placeholder="状态"
              :default-value="selectedtStatus"
              v-if="userStatus"
              disabled
            >
              <a-select-option
                v-for="item in userStatus"
                :key="item.key"
                disabled
              >
                {{ item.value }}
              </a-select-option>
            </a-select> -->
          </a-descriptions-item>
          <a-descriptions-item label="子角色" :span="2">
            <a-input
              v-model="selectedSubRole"
              disabled
              style="width:200px"
            ></a-input>
            <!-- <a-select
              style="width: 200px"
              placeholder="子角色"
              :default-value="selectedSubRole"
              v-if="subRole"
              disabled
            >
              <a-select-option v-for="item in subRole" :key="item.key">
                {{ item.value }}
              </a-select-option> </a-select
            > --><span style="margin-left:20px"
              >项目类型中包含房产类及工程类时默认都可见。</span
            >
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
const userStatus = [
  { key: 0, value: "允许登录" },
  { key: 1, value: "禁止登录" },
  { key: 2, value: "待审批" },
];
const subRole = [
  { key: 0, value: "检查/审核全部" },
  { key: 1, value: "检查/审核房产" },
  { key: 2, value: "检查/审核工程" },
];
export default {
  props: ["selecteduser"],
  data() {
    return {
      userStatus,
      subRole,
      userName: "",
      userPassword: "111",
      userEMail: "",
      userCompany: "昆山市城乡房产测量有限公司",
      userLinkMan: "",
      userLinkManPhone: "",
      userLinkManMBPhone: "",
      organizationChecked: false,
      roledata: [],
      userRole: [],
      selectedtStatus: 0,
      selectedSubRole: 0,
      spinning: false,
    };
  },
  methods: {
    async getRole() {
      this.spinning = true;
      axios
        .get(GLOBAL.env + "/usermanagement/getroles")
        .then((res) => {
          this.roledata = res.data;
        })
        .then(() => {
          axios
            .get(GLOBAL.env + "/usermanagement/getuserinfo", {
              params: {
                userid: this.selecteduser,
              },
            })
            .then((res) => {
              console.log(res);
              const tmp_result = res.data[0];
              this.userName = tmp_result.userName;
              this.userCompany = tmp_result.company;
              this.userLinkMan = tmp_result.linkman;
              this.userLinkManPhone = tmp_result.linkmanphone;
              this.userLinkManMBPhone = tmp_result.linkmanmbphone;
              this.userEMail = tmp_result.email;
              this.userRole = tmp_result.userrole.split(",").map(Number);
              this.selectedtStatus = tmp_result.status;
              this.selectedSubRole = tmp_result.selectedSubRole;
              if (tmp_result.usergroup == 0) {
                this.organizationChecked = true;
              } else {
                this.organizationChecked = false;
              }
            });
        });
      this.spinning = false;
    },
  },
  mounted: function() {
    this.getRole();
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
