<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions title="合同信息" bordered :column="2" size="small">
          <a-descriptions-item label="合同编号" :span="1">
            <a-badge dot>
              <a-input
                placeholder="合同编号"
                v-model="contractID"
                :disabled="disableEdit"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="合同(项目)名称" :span="1">
            <a-badge dot>
              <a-input
                placeholder="合同(项目)名称"
                v-model="contractName"
                :disabled="disableEdit"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="乙方(委托)单位" :span="1">
            <a-badge dot>
              <a-input
                placeholder="乙方(委托)单位"
                v-model="contractClient"
                :disabled="disableEdit"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="合同代建单位" :span="1">
            <a-input
              placeholder="合同代建单位"
              v-model="contractCompany"
              :disabled="disableEdit"
            >
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="合同签订时间" :span="1">
            <a-badge dot>
              <a-date-picker
                style="width:100%"
                @change="getSignDate"
                v-if="contractSignDate"
                :defaultValue="moment(contractSignDate || null, 'YYYY-MM-DD')"
                :disabled="disableEdit"
              />
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="合同金额" :span="1">
            <a-badge dot>
              <a-input
                placeholder="合同金额"
                v-model="contractExpense"
                :disabled="disableEdit"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="合同起始时间" :span="1">
            <a-date-picker
              style="width:100%"
              @change="getContractStartDate"
              v-if="contractStartDate"
              :defaultValue="moment(contractStartDate, 'YYYY-MM-DD')"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="合同结束时间" :span="1">
            <a-date-picker
              style="width:100%"
              @change="getContractEndDate"
              v-if="contractEndDate"
              :defaultValue="moment(contractEndDate, 'YYYY-MM-DD')"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="备注说明" :span="2">
            <a-input
              placeholder="备注说明"
              v-model="contractRemark"
              :disabled="disableEdit"
            >
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="文件列表" :span="2">
            <div class="supportMaterials">
              <a-list
                size="small"
                bordered
                :data-source="savedFileList"
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
    </a-spin>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelContractModify">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmContractModify">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GLOBAL from "../../../../utils/global_variable";
import request from "@/utils/request";
import moment from "moment";
export default {
  props: ["selectid"],
  data() {
    return {
      contractID: "",
      contractName: "",
      contractClient: "",
      contractCompany: "",
      contractExpense: "",
      contractRemark: "",
      contractSignDate: "",
      contractStartDate: "",
      contractEndDate: "",
      fileList: [],
      savedFileList: [],
      uploading: false,
      spinning: false,
      disableEdit: false,
    };
  },
  methods: {
    moment,
    async getConrtactDetail() {
      this.spinning = true;
      const tmp_data = await request.get(
        "/contractmanagement/viewcontractdetail",
        {
          params: {
            id: this.selectid,
          },
        }
      );
      const datas = tmp_data.data[0];
      this.contractID = datas.contractId;
      this.contractName = datas.contractName;
      this.contractClient = datas.contractClient;
      this.contractExpense = datas.contractExpense;
      this.contractCompany = datas.contractCompany;
      this.contractRemark = datas.contractOtherInfo;
      if (datas.contractFileList) {
        this.savedFileList = datas.contractFileList.split("\/");
      }
      this.contractEndDate = datas.contractEndDate;
      if (!this.contractEndDate) {
        this.contractEndDate = "0001-01-01";
      }
      this.contractSignDate = datas.contractSignDate;
      if (!this.contractSignDate) {
        this.contractSignDate = "0001-01-01";
      }
      this.contractStartDate = datas.contractStartDate;
      if (!this.contractStartDate) {
        this.contractStartDate = "0001-01-01";
      }
      console.log(datas);
      this.spinning = false;
    },
    getSignDate(date, dateString) {
      this.contractSignDate = dateString;
    },
    getContractStartDate(date, dateString) {
      this.contractStartDate = dateString;
    },
    getContractEndDate(date, dateString) {
      this.contractEndDate = dateString;
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
    cancelContractModify() {
      this.$emit("childFn");
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      let existedFileStr = "";
      if (this.savedFileList.length != 0) {
        for (let i = 0; i < this.savedFileList.length; i++) {
          existedFileStr += this.savedFileList[i] + "\/";
        }
        existedFileStr = existedFileStr.slice(0, existedFileStr.length - 1);
      }
      formData.append("existedFiles", existedFileStr);
      formData.append("contractid", this.selectid);
      this.uploading = true;
      axios
        .post(GLOBAL.env + "/contractmanagement/uploadcontractFile", formData)
        .then((res) => {
          if (res.data === "upload over") {
            this.$message.success("上传成功");
            this.fileList = [];
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
          this.getConrtactDetail();
        });
    },
    confirmContractModify() {
      console.log(this.selectid);
      if (this.contractID === "") {
        this.$message.error("合同编号为必填项目");
        return;
      }
      if (this.contractName === "") {
        this.$message.error("合同名称为必填项目");
        return;
      }
      if (this.contractClient === "") {
        this.$message.error("乙方(委托)单位为必填项目");
        return;
      }
      if (this.contractSignDate === "") {
        this.$message.error("合同签订时间为必填项目");
        return;
      }
      if (this.contractExpense === "") {
        this.$message.error("金额为必填项目");
        return;
      }
      let infoparams = new URLSearchParams();
      infoparams.append("Id", this.selectid);
      infoparams.append("contractid", this.contractID);
      infoparams.append("contractname", this.contractName);
      infoparams.append("contractclient", this.contractClient);
      infoparams.append("contractcompany", this.contractCompany);
      infoparams.append("contractsigndate", this.contractSignDate);
      infoparams.append("contractexpense", this.contractExpense);
      infoparams.append("contractstartdate", this.contractStartDate);
      infoparams.append("contractenddate", this.contractEndDate);
      infoparams.append("contractremark", this.contractRemark);
      axios
        .post(GLOBAL.env + "/contractmanagement/modifycontractinfo", infoparams)
        .then((res) => {
          console.log(res);
          if (res.data[0].result === "success") {
            this.$message.success("合同修改成功");
            if (this.fileList.length == -0) {
              let postParams2 = new URLSearchParams();
              let existedFileStr = "";
              if (this.savedFileList.length != 0) {
                for (let i = 0; i < this.savedFileList.length; i++) {
                  existedFileStr += this.savedFileList[i] + "\/";
                }
                existedFileStr = existedFileStr.slice(
                  0,
                  existedFileStr.length - 1
                );
              }
              postParams2.append("existedFiles", existedFileStr);
              postParams2.append("Id", this.selectid);
              axios
                .post(
                  GLOBAL.env +
                    "/contractmanagement/modifycontractwithoutnewfile",
                  postParams2
                )
                .then((res) => {
                  if (res.data === "success") {
                    this.$message.success("文件修改成功");
                    this.getConrtactDetail();
                  }
                });
            } else {
              this.handleUpload();
            }
          } else {
            this.$message.error("修改失败");
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
      const index = this.savedFileList.indexOf(item);
      const newFileList = this.savedFileList.slice();
      newFileList.splice(index, 1);
      this.savedFileList = newFileList;
    },
  },
  mounted: function() {
    console.log("select id", this.selectid);
    this.getConrtactDetail();
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
