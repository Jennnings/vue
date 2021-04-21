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
              :value="contractEndDate"
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
                </a-list-item>
              </a-list>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-spin>
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
      disableEdit: true,
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
      // this.contractEndDate = datas.contractEndDate;
      // if (!this.contractEndDate) {
      //   this.contractEndDate = "0001-01-01";
      // }
      console.log(datas.contractEndDate);
      if (datas.contractEndDate !== "1990-01-01") {
        this.contractEndDate = moment(datas.contractEndDate, "YYYY-MM-DD");
      } else {
        console.log("xxx");
        this.contractEndDate = "";
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
    cancelContractCreate() {
      this.$emit("childFn");
    },
    confirmContractCreate() {
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
      let postParams = new URLSearchParams();
      postParams.append("contractname", this.contractName);
      postParams.append("contractclient", this.contractClient);
      postParams.append("contractstartdate", this.contractStartDate);
      postParams.append("contractenddate", this.contractEndDate);
      postParams.append("contractremark", this.contractRemark);
      postParams.append("contractid", this.contractID);
      postParams.append("contractexpense", this.contractExpense);
      postParams.append("contractsigndate", this.contractSignDate);
      postParams.append("contractcompany", this.contractCompany);
      axios
        .post(GLOBAL.env + "/contractmanagement/createcontract", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$emit("createSuccessChild");
          }
        });
    },
    handleUpload() {},
    async downloadFile(item) {
      const tmp_data = await request.get("/common/getcontract", {
        params: {
          postfilename: item,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/getcontract",
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
