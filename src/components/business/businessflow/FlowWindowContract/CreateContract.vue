<template>
  <div>
    <div class="projectInfo">
      <a-descriptions title="合同信息" bordered :column="2" size="small">
        <a-descriptions-item label="合同编号" :span="1">
          <a-badge dot>
            <a-input placeholder="合同编号" v-model="contractID">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="合同(项目)名称" :span="1">
          <a-badge dot>
            <a-input placeholder="合同(项目)名称" v-model="contractName">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="甲方(委托)单位" :span="1">
          <a-badge dot>
            <a-input placeholder="甲方(委托)单位" v-model="contractClient">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="合同代建单位" :span="1">
          <a-input placeholder="合同代建单位" v-model="contractCompany">
          </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="合同签订时间" :span="1">
          <a-badge dot>
            <a-date-picker style="width:100%" @change="getSignDate" />
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="合同金额" :span="1">
          <a-badge dot>
            <a-input placeholder="合同金额" v-model="contractExpense">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="合同起始时间" :span="1">
          <a-date-picker style="width:100%" @change="getContractStartDate" />
        </a-descriptions-item>
        <a-descriptions-item label="合同结束时间" :span="1">
          <a-date-picker style="width:100%" @change="getContractEndDate" />
        </a-descriptions-item>
        <a-descriptions-item label="结算金额" :span="1">
          <a-input placeholder="结算金额" v-model="balanceExpense"> </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="到账金额" :span="1">
          <a-input placeholder="到账金额" v-model="paidInAmount"> </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="收费类型" :span="1">
          <a-checkbox :checked="isTotalPrice" @change="isTotalPriceChanged">
            总价合同
          </a-checkbox>
        </a-descriptions-item>
        <a-descriptions-item label="备注说明" :span="1">
          <a-input placeholder="备注说明" v-model="contractRemark"> </a-input>
        </a-descriptions-item>
        <a-descriptions-item label="文件列表" :span="2"> </a-descriptions-item>
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
            <!-- <div class="tempFile">
              <a-button
                type="primary"
                :disabled="fileList.length === 0"
                :loading="uploading"
                style="margin-top: 16px"
                @click="handleUpload"
              >
                {{ uploading ? "正在上传..." : "开始上传" }}
              </a-button>
            </div> -->
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelContractCreate">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmContractCreate">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
export default {
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
      balanceExpense: "",
      paidInAmount: "",
      fileList: [],
      savedFileList: [],
      uploading: false,
      isTotalPrice: false,
    };
  },
  methods: {
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
      this.$emit("createSuccessChild");
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
        this.$message.error("甲方(委托)单位为必填项目");
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
      postParams.append("balanceexpense", this.balanceExpense);
      postParams.append("paidinamount", this.paidInAmount);
      postParams.append("istotalprice", this.isTotalPrice);
      axios
        .post(GLOBAL.env + "/contractmanagement/createcontract", postParams)
        .then((res) => {
          if (res.data[0].msg == "success") {
            console.log(res);
            if (this.fileList.length) {
              this.handleUpload(res.data[0].contractid);
              this.$message.success("新建合同成功");
            }
            this.$emit("createSuccessChild");
          } else {
            this.$message.error("新建合同失败");
          }
        });
    },
    handleUpload(contractid) {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      formData.append("contractid", contractid);
      formData.append("existedFiles", "");
      this.uploading = true;
      axios
        .post(
          GLOBAL.env_file + "/contractmanagement/uploadcontractFile",
          formData
        )
        .then((res) => {
          // console.log(res);
          if (res.data === "upload over") {
            this.$message.success("上传成功");
            // this.$emit("childFn");
            this.fileList = [];
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    isTotalPriceChanged() {
      this.isTotalPrice = !this.isTotalPrice;
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
