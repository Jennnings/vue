<template>
  <div>
    <div>
      <a-spin :spinning="spinning">
        <div class="projectInfo">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="项目名称" :span="2">
              <a-badge dot>
                <a-input
                  placeholder="项目名称"
                  :disabled="disableEdit"
                  v-model="params.projectName"
                >
                  <a-tooltip slot="suffix" title="必填项目">
                    <a-icon type="info-circle" style="color: red" />
                  </a-tooltip>
                </a-input>
              </a-badge>
            </a-descriptions-item>
            <a-descriptions-item label="合同编号">
              <a-select
                show-search
                placeholder="选择合同编号"
                option-filter-prop="children"
                style="width:100%"
                allow-clear
                v-model="contractDefaultSelected"
                :filter-option="filterOptionWithID"
                @change="handleChangeWithID"
              >
                <a-select-option v-for="item in contractInfo" :key="item.index">
                  {{ item.HetongBianhao }}
                </a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="合同名称">
              <a-select
                show-search
                placeholder="选择合同名称"
                option-filter-prop="children"
                style="width:100%"
                v-model="contractDefaultSelected"
                :filter-option="filterOptionWithID"
                allow-clear
                @change="handleChangeWithName"
              >
                <a-select-option v-for="item in contractInfo" :key="item.index">
                  {{ item.Hetongname }}
                </a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="委托单位">
              <a-badge dot>
                <a-input
                  placeholder="委托单位"
                  :disabled="disableEdit"
                  v-model="params.clientName"
                >
                  <a-tooltip slot="suffix" title="必填项目">
                    <a-icon type="info-circle" style="color: red" />
                  </a-tooltip>
                </a-input>
              </a-badge>
            </a-descriptions-item>
            <a-descriptions-item label="代建单位">
              <a-input
                placeholder="代建单位"
                :disabled="disableEdit"
                v-model="params.djUnit"
              />
            </a-descriptions-item>
            <a-descriptions-item label="委托时间">
              <a-badge dot>
                <a-date-picker
                  style="width:100%"
                  :disabled="disableEdit"
                  v-if="params.clientDate"
                  :defaultValue="moment(params.clientDate, 'YYYY-MM-DD')"
                  @change="getcreateTime"
                />
              </a-badge>
            </a-descriptions-item>
            <a-descriptions-item label="委托单位地址">
              <a-input
                placeholder="委托单位地址"
                :disabled="disableEdit"
                v-model="params.clientAddress"
              />
            </a-descriptions-item>
            <a-descriptions-item label="委托人">
              <a-input
                placeholder="委托人"
                :disabled="disableEdit"
                v-model="params.clientPeople"
              />
            </a-descriptions-item>
            <a-descriptions-item label="委托人电话">
              <a-input
                placeholder="委托人电话"
                :disabled="disableEdit"
                v-model="params.clientPeopleTel"
              />
            </a-descriptions-item>
            <a-descriptions-item label="联系人">
              <a-input
                placeholder="联系人"
                :disabled="disableEdit"
                v-model="params.contactPeople"
              />
            </a-descriptions-item>
            <a-descriptions-item label="联系人电话">
              <a-input
                placeholder="联系人电话"
                :disabled="disableEdit"
                v-model="params.contactPeopleTel"
              />
            </a-descriptions-item>
            <a-descriptions-item label="项目类型" :span="2">
              <a-badge dot>
                <a-checkbox-group
                  :disabled="disableEdit"
                  :value="projectTypeSelected"
                  @change="projectTypeSelection"
                >
                  <div class="supportMaterials">
                    <div v-for="data in projectType" :key="data.index">
                      <a-checkbox :value="data.index">
                        {{ data.value }}
                      </a-checkbox>
                    </div>
                  </div>
                </a-checkbox-group>
              </a-badge>
            </a-descriptions-item>
            <a-descriptions-item label="现场坐落">
              <a-input
                placeholder="现场坐落"
                :disabled="disableEdit"
                v-model="params.projectAddress"
              />
            </a-descriptions-item>
            <a-descriptions-item label="希望进场时间">
              <a-badge dot>
                <a-date-picker
                  style="width:100%"
                  :disabled="disableEdit"
                  v-if="params.approachTime"
                  :defaultValue="moment(params.approachTime, 'YYYY-MM-DD')"
                  @change="hopeToEnterTime"
                />
              </a-badge>
            </a-descriptions-item>
            <a-descriptions-item label="其他要求" :span="2">
              <a-textarea
                placeholder="其他要求"
                :rows="2"
                :disabled="disableEdit"
                v-model="params.otherInfo"
              />
            </a-descriptions-item>
            <a-descriptions-item label="资料清单" :span="2">
              <a-checkbox-group
                :disabled="disableEdit"
                :value="supportMaterialsSelected"
                @change="supportMaterials"
              >
                <div class="supportMaterials">
                  <div v-for="data in otherMaterial" :key="data.index">
                    <a-checkbox :value="data.index">
                      {{ data.value }}
                    </a-checkbox>
                  </div>
                </div>
              </a-checkbox-group>
            </a-descriptions-item>
            <a-descriptions-item label="文件列表" :span="2">
              <div class="supportMaterials">
                <a-list
                  size="small"
                  bordered
                  :data-source="supportFileList"
                  style="width:100%"
                >
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a @click="downloadFile(item)">{{ item }}</a>

                    <div slot="actions">
                      <a-popconfirm
                        title="是否确认删除？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteSelectItem"
                      >
                        <a>删除</a>
                      </a-popconfirm>
                    </div>
                  </a-list-item>
                </a-list>
              </div>
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
            <a-button type="primary" @click="confirmProjectModify">
              确认
            </a-button>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script>
import projectdata from "./../../../../../assets/menulist/project-type.json";
import listdata from "./../../../../../assets/menulist/other-material.json";
import axios from "axios";
import request from "@/utils/request";
import GLOBAL from "./../../../../../utils/global_variable";
const projectData = projectdata;
const listData = listdata;
import moment from "moment";
export default {
  props: ["projectInfo", "XMState"],
  data() {
    return {
      projectType: projectData.data,
      otherMaterial: listData.data,
      disableEdit: false,
      projectName: "",
      params: {},
      projectTypeSelected: [],
      supportMaterialsSelected: [],
      spinning: false,
      contractInfo: [],
      contractDefaultSelected: "",
      fileList: [],
      uploading: false,
      supportFileList: [],
    };
  },
  methods: {
    moment,
    async initProjectDetail() {
      this.spinning = true;
      const that = this;
      const tmp_data = await request.get("/common/getprojectdetail", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      let objGroup = tmp_data.data[0];
      Object.keys(objGroup).forEach(function(k) {
        if (objGroup[k] === "undefined" || objGroup[k] === null) {
          that.params[k] = "";
        } else {
          if (k === "projectTypeID") {
            that.projectTypeSelected = objGroup[k].split(",").map(Number);
          } else if (k === "supportMaterial") {
            that.supportMaterialsSelected = objGroup[k].split(",").map(Number);
          } else if (k === "HTId") {
            that.contractDefaultSelected = objGroup[k];
          } else if (k === "supportFileList") {
            that.supportFileList = objGroup[k].split("/");
          } else {
            that.params[k] = objGroup[k];
          }
        }
      });
      this.spinning = false;
    },
    async getContractInfo() {
      const tmpdata = await request.get("/common/getcontractinfo");
      this.contractInfo = tmpdata.data;
    },
    handleChangeWithID(value) {
      this.contractDefaultSelected = value;
    },
    handleChangeWithName(value) {
      this.contractDefaultSelected = value;
    },
    //依据合同ID检索信息
    filterOptionWithID(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //文件操作
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
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      formData.append("projectid", this.params.projectId);
      let existedFileStr = "";
      if (this.supportFileList.length != 0) {
        for (let i = 0; i < this.supportFileList.length; i++) {
          existedFileStr += this.supportFileList[i] + "\/";
        }
        existedFileStr = existedFileStr.slice(0, existedFileStr.length - 1);
      }
      formData.append("existedFiles", existedFileStr);
      this.uploading = true;
      axios
        .post(GLOBAL.env + "/common/modifyprojectfile", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            this.initProjectDetail();
            this.fileList = [];
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    //取消项目更新
    cancelProjectCreate() {
      this.$emit("childFn");
    },
    //项目更新创建时间
    getcreateTime(date, dateString) {
      this.params.clientDate = dateString;
    },
    //项目更新 更新希望进场时间
    hopeToEnterTime(date, dateString) {
      this.params.approachTime = dateString;
    },
    //项目更新 更新项目类型
    projectTypeSelection(e) {
      this.projectTypeSelected = e;
    },
    //项目更新 更新资料清单
    supportMaterials(e) {
      this.supportMaterialsSelected = e;
    },
    confirmProjectModify() {
      const that = this;
      this.params["projectTypeChecked"] = this.projectTypeSelected;
      this.params["otherMaterial"] = this.supportMaterialsSelected;
      if (this.params.projectName == "") {
        this.$message.error("项目名称为必填");
        return;
      }
      if (this.params.projectClient == "") {
        this.$message.error("委托单位为必填");
        return;
      }
      if (this.params.clientDate == "") {
        this.$message.error("委托时间为必填");
        return;
      }
      if (this.params.approachTime == "") {
        this.$message.error("希望进场时间为必填");
        return;
      }
      if (this.params.projectTypeChecked.length == 0) {
        this.$message.error("请选择项目类型");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("Prjectsn", this.projectInfo);
      postParams.append("projectName", this.params.projectName); // 项目名称
      postParams.append("projectClient", this.params.clientName); // 委托单位名称
      postParams.append("createTime", this.params.clientDate); // 委托时间
      postParams.append("clientAddress", this.params.clientAddress); // 委托单位地址
      postParams.append("client", this.params.clientPeople); // 委托人
      postParams.append("clientTelephone", this.params.clientPeopleTel); // 委托人电话
      postParams.append("contactPerson", this.params.contactPeople); // 联系人
      postParams.append("contactTelephone", this.params.contactPeopleTel); // 联系人电话
      // postParams.append("aggreementID", this.params.contractID); // 合同编号
      // postParams.append("aggrementName", this.params.Hetongname); // 合同名称
      let selectedContractID = "";
      if (this.contractDefaultSelected) {
        selectedContractID = this.contractInfo.filter(
          (item) => item.index === this.contractDefaultSelected
        )[0].HetongBianhao;
      }
      postParams.append("aggreementID", selectedContractID); //合同编号
      postParams.append("agentConstruction", this.params.djUnit); // 代建单位名称
      postParams.append("projectTypeChecked", this.params.projectTypeChecked); // 项目类型
      postParams.append("sceneLocation", this.params.projectAddress); // 现场坐落
      postParams.append("hopeToEnterTime", this.params.approachTime); // 希望进场时间
      postParams.append("otherRequirement", this.params.otherInfo); // 其他要求
      postParams.append("otherMaterial", this.params.otherMaterial); // 其他资料清单
      postParams.append("projectid", this.params.projectId);
      postParams.append(
        "DjmanUserID",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      ); // 登记人员ID
      axios
        .post(GLOBAL.env + "/common/modifyproject", postParams)
        .then((res) => {
          if (res.data[0].result === "success") {
            if (this.fileList.length == 0) {
              let postParams2 = new URLSearchParams();
              let existedFileStr = "";
              if (this.supportFileList.length != 0) {
                for (let i = 0; i < this.supportFileList.length; i++) {
                  existedFileStr += this.supportFileList[i] + "\/";
                }
                existedFileStr = existedFileStr.slice(
                  0,
                  existedFileStr.length - 1
                );
              }
              postParams2.append("existedFiles", existedFileStr);
              postParams2.append("projectid", this.params.projectId);
              axios
                .post(GLOBAL.env + "/common/withoutnewfile", postParams2)
                .then((res) => {
                  if (res.data === "success") {
                    this.$message.success("更新成功");
                    this.initProjectDetail();
                  }
                });
            } else {
              this.handleUpload();
            }
          } else {
            this.$message.error("更新失败");
          }
        });
    },
    async downloadFile(item) {
      const tmp_data = await request.get("/common/downloadfile", {
        params: {
          postfilename: item,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/downloadfile",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          postfilename: item,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
    deleteSelectItem(item) {
      const index = this.supportFileList.indexOf(item);
      const newFileList = this.supportFileList.slice();
      newFileList.splice(index, 1);
      this.supportFileList = newFileList;
    },
  },
  mounted: function() {
    this.initProjectDetail();
    this.getContractInfo();
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
