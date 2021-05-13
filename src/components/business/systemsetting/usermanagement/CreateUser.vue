<template>
  <div>
    <div class="projectInfo">
      <a-descriptions :column="2" bordered size="small">
        <a-descriptions-item label="用户名" :span="2">
          <a-badge dot>
            <a-input placeholder="用户名" v-model="userName">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="密码" :span="1">
          <a-badge dot>
            <a-input-password placeholder="密码" v-model="userPassword">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input-password>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="邮箱" :span="1">
          <a-input placeholder="邮箱" v-model="userEMail"> </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="单位" :span="1">
          <a-badge dot>
            <a-input placeholder="单位" v-model="userCompany">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="姓名" :span="1">
          <a-badge dot>
            <a-input placeholder="姓名" v-model="userLinkMan">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="电话" :span="1">
          <a-input placeholder="电话" v-model="userLinkManPhone"> </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="手机" :span="1">
          <a-badge dot>
            <a-input placeholder="手机" v-model="userLinkManMBPhone">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="角色" :span="2">
          <a-checkbox-group @change="onUserRoleSelectChange">
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
          <a-checkbox @change="onOrganizationChecked">
            昆山市城乡房产测量有限公司
          </a-checkbox>
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="1">
          <a-select
            style="width: 200px"
            placeholder="状态"
            default-value="允许登录"
            v-if="userStatus"
            @change="selectuserStatus"
          >
            <a-select-option v-for="item in userStatus" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="子角色" :span="2">
          <a-select
            style="width: 200px"
            placeholder="子角色"
            default-value="检查/审核全部"
            v-if="subRole"
            @change="onSelectSubRole"
          >
            <a-select-option v-for="item in subRole" :key="item.key">
              {{ item.value }}
            </a-select-option> </a-select
          ><span style="margin-left:20px"
            >项目类型中包含房产类及工程类时默认都可见。</span
          >
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelCreateUser">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmCreateUser">
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
      organizationChecked: "",
      roledata: [],
      userRole: [],
      selectedtStatus: 0,
      selectedSubRole: 0,
    };
  },
  methods: {
    async getRole() {
      //this.spinning = true;
      const tmp_data = await request.get("usermanagement/getroles");
      this.roledata = tmp_data.data;
      //this.spinning = false;
    },
    onUserRoleSelectChange(checkedValues) {
      this.userRole = checkedValues;
      console.log(this.userRole);
    },
    onOrganizationChecked(e) {
      if (e.target.checked) {
        this.organizationChecked = "0";
      } else {
        this.organizationChecked = "";
      }
      console.log(this.organizationChecked);
    },
    selectuserStatus(value) {
      this.selectedtStatus = value;
    },
    onSelectSubRole(value) {
      this.selectedSubRole = value;
    },
    cancelCreateUser() {
      this.$emit("closeModal");
    },
    confirmCreateUser() {
      if (this.userName == "") {
        this.$message.warning("用户名为必填项");
        return;
      }
      if (this.userPassword == "") {
        this.$message.warning("用户密码为必填项");
        return;
      }
      if (this.userLinkMan == "") {
        this.$message.warning("用户姓名为必填项");
        return;
      }
      if (this.userLinkManMBPhone == "") {
        this.$message.warning("手机为必填项");
        return;
      }
      if (this.userRole.length == 0) {
        this.$message.warning("请至少选择一个角色");
        return;
      }
      if (this.userCompany == "") {
        this.$message.warning("请填写单位信息");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("username", this.userName);
      postParams.append("password", this.userPassword);
      postParams.append("status", this.selectedtStatus);
      postParams.append("linkman", this.userLinkMan);
      postParams.append("linkmanphone", this.userLinkManPhone);
      postParams.append("linkmanmbphone", this.userLinkManMBPhone);
      postParams.append("zizhilevel", this.selectedSubRole);
      postParams.append("company", this.userCompany);
      postParams.append("usergroup", this.organizationChecked);
      postParams.append("email", this.userEMail);
      let role_str = "";
      this.userRole.forEach((element) => {
        role_str += element + ",";
      });
      postParams.append("userrole", role_str);
      axios
        .post(GLOBAL.env + "/usermanagement/createuser", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("新用户创建成功");
            this.$emit("closeModal");
          } else if (res.data == "existed") {
            this.$message.warning("用户名已存在");
          } else {
            this.$message.error("创建失败");
          }
        });
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
