<template>
  <div>
    <div>
      <a-spin :spinning="spinning">
        <div class="projectInfo">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="项目名称" :span="2">
              <a-input
                placeholder="项目名称"
                :disabled="disableEdit"
                v-model="params.projectName"
              />
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
              <a-input
                placeholder="委托单位"
                :disabled="disableEdit"
                v-model="params.clientName"
              />
            </a-descriptions-item>
            <a-descriptions-item label="代建单位">
              <a-input
                placeholder="代建单位"
                :disabled="disableEdit"
                v-model="params.djUnit"
              />
            </a-descriptions-item>
            <a-descriptions-item label="委托时间">
              <a-date-picker
                style="width:100%"
                :disabled="disableEdit"
                v-if="params.clientDate"
                :defaultValue="moment(params.clientDate, 'YYYY-MM-DD')"
              />
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
              <a-checkbox-group
                :disabled="disableEdit"
                :value="projectTypeSelected"
              >
                <div class="supportMaterials">
                  <div v-for="data in projectType" :key="data.index">
                    <a-checkbox :value="data.index">
                      {{ data.value }}
                    </a-checkbox>
                  </div>
                </div>
              </a-checkbox-group>
            </a-descriptions-item>
            <a-descriptions-item label="现场坐落">
              <a-input
                placeholder="现场坐落"
                :disabled="disableEdit"
                v-model="params.projectAddress"
              />
            </a-descriptions-item>
            <a-descriptions-item label="希望进场时间">
              <a-date-picker
                style="width:100%"
                :disabled="disableEdit"
                v-if="params.approachTime"
                :defaultValue="moment(params.approachTime, 'YYYY-MM-DD')"
              />
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
                    <a slot="actions" @click="deleteSelectItem(item)">删除</a>
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
      console.log(that.params);
    },
    async getContractInfo() {
      const tmpdata = await request.get("/common/getcontractinfo");
      this.contractInfo = tmpdata.data;
      //console.log(this.contractInfo);
    },
    handleChangeWithID(value) {
      //console.log(`selected ${value}`);
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
    cancelProjectCreate() {},
    confirmProjectModify() {},
    async downloadFile(item) {
      console.log(item);
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
        console.log(response);

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
      console.log(item);
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
