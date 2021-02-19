<template>
  <div>
    <div class="projectInfo">
      <a-descriptions title="项目信息" bordered :column="2" size="small">
        <a-form-item label="项目名称" :span="1">
          <a-badge dot>
            <a-input
              placeholder="项目名称"
              name="projectname"
              v-model="params.projectName"
              aria-required="true"
              autocomplete="off"
            >
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-form-item>
        <a-descriptions-item label="委托单位" :span="1">
          <a-badge dot>
            <a-input placeholder="委托单位" v-model="params.projectClient">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="委托时间" :span="1">
          <a-badge dot>
            <a-date-picker
              style="width:100%"
              @change="getcreateTime"
              v-if="params.createTime"
              :defaultValue="moment(params.createTime, 'YYYY-MM-DD')"
            />
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="委托单位地址" :span="1">
          <a-input placeholder="委托单位地址" v-model="params.clientAddress" />
        </a-descriptions-item>
        <a-descriptions-item label="委托人" :span="1">
          <a-input placeholder="委托人" v-model="params.client" />
        </a-descriptions-item>
        <a-descriptions-item label="委托人电话" :span="1">
          <a-input placeholder="委托人电话" v-model="params.clientTelephone" />
        </a-descriptions-item>
        <a-descriptions-item label="联系人" :span="1">
          <a-input placeholder="联系人" v-model="params.contactPerson" />
        </a-descriptions-item>
        <a-descriptions-item label="联系人电话" :span="1">
          <a-input placeholder="联系人电话" v-model="params.contactTelephone" />
        </a-descriptions-item>
        <a-descriptions-item label="合同编号" :span="1">
          <a-input placeholder="合同编号" v-model="params.aggreementID" />
        </a-descriptions-item>
        <a-descriptions-item label="合同名称" :span="1">
          <a-input placeholder="合同名称" v-model="params.aggrementName" />
        </a-descriptions-item>
        <a-descriptions-item label="代建单位" :span="2">
          <a-input placeholder="代建单位" v-model="params.agentConstruction" />
        </a-descriptions-item>
        <a-descriptions-item label="项目类型" :span="2">
          <a-badge dot>
            <a-checkbox-group
              @change="projectTypeSelection"
              :value="projectTypeSelected"
            >
              <div class="supportMaterials">
                <div v-for="data in projectType" :key="data.key">
                  <a-checkbox :value="data.key">
                    {{ data.value }}
                  </a-checkbox>
                </div>
              </div>
            </a-checkbox-group>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="现场坐落" :span="1">
          <a-input placeholder="现场坐落" v-model="params.sceneLocation" />
        </a-descriptions-item>
        <a-descriptions-item label="希望进场时间" :span="1">
          <a-date-picker style="width:100%" @change="hopeToEnterTime" />
        </a-descriptions-item>
        <a-descriptions-item label="其他要求" :span="2">
          <a-textarea
            placeholder="其他要求"
            :rows="3"
            v-model="params.otherRequirement"
          />
        </a-descriptions-item>
        <a-descriptions-item label="资料清单" :span="2">
          <a-checkbox-group @change="supportMaterials">
            <div class="supportMaterials">
              <div v-for="data in otherMaterial" :key="data.index">
                <a-checkbox :value="data.key">
                  {{ data.value }}
                </a-checkbox>
              </div>
            </div>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="文件上传" :span="2">
          <div class="clearfix">
            <div class="tempFile">
              <a-upload
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
              >
                <a-button> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
            </div>
            <div class="tempFile">
              <a-button
                type="primary"
                :disabled="fileList.length === 0"
                :loading="uploading"
                style="margin-top: 16px"
                @click="handleUpload"
              >
                {{ uploading ? "正在上传..." : "开始上传" }}
              </a-button>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelProjectCreate">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmProjectCreate">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import listdata from "../../../../assets/menulist/other-material.json";
import projectdata from "../../../../assets/menulist/project-type.json";
import axios from "axios";
const listData = listdata;
const projectData = projectdata;
import request from "@/utils/request";
import moment from "moment";
import GLOBAL from "./../../../../utils/global_variable";
export default {
  name: "mofify-project",
  props: ["projectInfo"],
  data() {
    return {
      fileList: [],
      uploading: false,
      otherMaterial: listData.data,
      projectType: projectData.data,
      params: {
        projectName: "",
        projectClient: "",
        createTime: "",
      },

      projectTypeSelected: [],
      supportMaterialsSelected: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      postParams: null,
    };
  },
  methods: {
    async getProjectInfo() {
      const tmpdata = await request("/cxch/modifyProjectInfoQuery", {
        params: {
          Projectsn: this.projectInfo,
        },
      });
      this.params.projectName = tmpdata.data[0].Projectname;
      this.params.createTime = tmpdata.data[0].Clientdate;
      this.params.projectClient = tmpdata.data[0].Client;
      this.params.clientAddress = tmpdata.data[0].Projectaddress;
      this.params.client = tmpdata.data[0].Clientpeople;
      this.params.clientTelephone = tmpdata.data[0].Clientpeopletel;
      this.projectTypeSelected = tmpdata.data[0].Projecttypeid.split(",").map(
        Number
      );
      console.log("modify data", tmpdata.data[0]);
    },
    moment,
    confirmProjectCreate() {
      console.log("create Project");
      this.params["projectTypeChecked"] = this.projectTypeSelected;
      this.params["otherMaterial"] = this.supportMaterialsSelected;
      console.log("params", this.params);
      if (this.params.projectName == "") {
        this.$message.error("项目名称为必填");
        return;
      }
      if (this.params.projectClient == "") {
        this.$message.error("委托单位为必填");
        return;
      }
      if (this.params.createTime == "") {
        this.$message.error("委托时间为必填");
        return;
      }
      if (this.params.projectTypeChecked.length == 0) {
        this.$message.error("请选择项目类型");
        return;
      }
      this.postParams = new URLSearchParams();
      this.postParams.append("projectName", this.params.projectName);
      this.postParams.append("projectClient", this.params.projectClient);
      this.postParams.append("createTime", this.params.createTime);
      this.postParams.append("client", this.params.client);
      this.postParams.append("clientTelephone", this.params.clientTelephone);
      this.postParams.append("contactPerson", this.params.contactPerson);
      this.postParams.append("contactTelephone", this.params.contactTelephone);
      this.postParams.append("aggreementID", this.params.aggreementID);
      this.postParams.append("aggrementName", this.params.aggrementName);
      this.postParams.append(
        "projectTypeChecked",
        this.params.projectTypeChecked
      );
      this.postParams.append("otherMaterial", this.params.otherMaterial);
      this.postParams.append(
        "DjmanUserID",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      //   axios
      //     .post("http://127.0.0.1:8000/cxch/insertProject", this.postParams)
      //     .then((res) => {
      //       console.log(res);
      //     });
      this.$emit("childFn");
    },
    cancelProjectCreate() {
      console.log("cancel Project");
      this.$emit("childFn");
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    getcreateTime(date, dateString) {
      this.params.createTime = dateString;
    },
    hopeToEnterTime(date, dateString) {
      this.params.hopeToEnterTime = dateString;
    },
    projectTypeSelection(e) {
      this.projectTypeSelected = e;
    },
    supportMaterials(e) {
      this.supportMaterialsSelected = e;
    },
    //文件上传前端
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      this.uploading = true;
      axios.post(GLOBAL.env + "/cxch/uploadfile", formData).then((res) => {
        console.log(res);
        if (res.data === "upload over") {
          this.$message.success("上传成功");
          this.fileList = [];
        } else {
          this.$message.error("上传失败");
        }
        this.uploading = false;
      });
    },
  },
  created: function() {
    this.getProjectInfo();
  },
};
</script>
<style lang="scss">
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small
  .ant-descriptions-item-content {
  padding: 4px 17px;
  user-select: none;
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
