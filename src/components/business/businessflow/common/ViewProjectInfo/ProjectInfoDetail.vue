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
              <a-input
                placeholder="合同编号"
                :disabled="disableEdit"
                v-model="params.contractID"
              />
            </a-descriptions-item>
            <a-descriptions-item label="合同名称">
              <a-input
                placeholder="合同名称"
                :disabled="disableEdit"
                v-model="params.Hetongname"
              />
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
                  </a-list-item>
                </a-list>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script>
import projectdata from "./../../../../../assets/menulist/project-type.json";
import listdata from "./../../../../../assets/menulist/other-material.json";
import request from "@/utils/request";
const projectData = projectdata;
const listData = listdata;
import axios from "axios";
import GLOBAL from "./../../../../../utils/global_variable";
import moment from "moment";
export default {
  props: ["projectInfo"],
  data() {
    return {
      projectType: projectData.data,
      otherMaterial: listData.data,
      disableEdit: true,
      projectName: "",
      params: {},
      projectTypeSelected: [],
      supportMaterialsSelected: [],
      supportFileList: [],
      spinning: false,
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
  },
  mounted: function() {
    this.initProjectDetail();
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
