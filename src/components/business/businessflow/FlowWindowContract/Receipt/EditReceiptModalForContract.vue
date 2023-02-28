<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="合同编号">
            <a-select
              show-search
              placeholder="选择合同编号"
              option-filter-prop="children"
              style="width:100%"
              allow-clear
              :disabled="disableEdit"
              v-model="contractDefaultSelected"
              :default-value="contractDefaultSelected"
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
              :default-value="contractDefaultSelected"
              :filter-option="filterOptionWithID"
              allow-clear
              :disabled="disableEdit"
              @change="handleChangeWithName"
            >
              <a-select-option v-for="item in contractInfo" :key="item.index">
                {{ item.Hetongname }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="甲方名称">
            <a-input
              placeholder="甲方名称"
              :disabled="disableEdit"
              v-model="HetongClient"
            />
          </a-descriptions-item>
          <a-descriptions-item label="合同金额">
            <a-input
              placeholder="合同金额"
              :disabled="disableEdit"
              v-model="HetongJine"
            />
          </a-descriptions-item>
          <a-descriptions-item label="开票日期">
            <a-badge dot>
              <a-date-picker style="width:100%" v-model="receiptDate" />
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="发票类型">
            <a-select
              placeholder="发票类型"
              style="width: 100%"
              v-model="receiptTypeSelected"
              :default-value="receiptTypeSelected"
              @change="receiptTypeSelectiton"
            >
              <a-select-option v-for="item in receiptType" :key="item.index">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="发票号码">
            <a-input placeholder="发票号码" v-model="receiptNum" />
          </a-descriptions-item>
          <a-descriptions-item label="发票含税金额(元)">
            <a-input placeholder="发票含税金额" v-model="receiptTax" />
          </a-descriptions-item>
          <a-descriptions-item label="收款日期">
            <a-date-picker style="width:100%" v-model="receiptInDate" />
          </a-descriptions-item>
          <a-descriptions-item label="收款金额(元)">
            <a-input placeholder="收款金额" v-model="receiptMoneyIn" />
          </a-descriptions-item>
          <a-descriptions-item label="发票备注" :span="2">
            <a-input placeholder="发票备注" v-model="receiptRemark" />
          </a-descriptions-item>
          <a-descriptions-item label="文件列表" :span="2">
            <div class="supportMaterials">
              <a-list
                size="small"
                bordered
                :data-source="receiptfileList"
                style="width:100%"
              >
                <a-list-item slot="renderItem" slot-scope="item">
                  <a @click="downloadFile(item)">{{ item }}</a>
                  <div slot="actions">
                    <a-popconfirm
                      title="是否确认删除？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="deleteSelectItem(item)"
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
                  accept=".pdf"
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
        <a-button @click="cancelReceiptModify">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmReceiptModify">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../../utils/global_variable";
import moment from "moment";
const receiptType = [
  {
    index: 1,
    value: "专票"
  },
  {
    index: 2,
    value: "普票"
  }
];
export default {
  props: ["selectedid"],
  data() {
    return {
      receiptType,
      disableEdit: true,
      contractId: "",
      contractName: "",
      HetongClient: "",
      HetongJine: "",
      receiptNum: "",
      receiptTax: "",
      receiptRemark: "",
      receiptInDate: "",
      receiptDate: "",
      receiptMoneyIn: "",
      receiptfileList: [],
      spinning: false,
      fileList: [],
      uploading: false,
      contractInfo: [],
      contractDefaultSelected: "",
      receiptTypeSelected: ""
    };
  },
  methods: {
    moment,
    async getContractInfo() {
      const tmpdata = await request.get("/common/getcontractinfo");
      this.contractInfo = tmpdata.data;
    },
    async getReceiptdetail() {
      this.spinning = true;
      const tmp_data = await request.get("/receipt/getdetailreceipt", {
        params: {
          id: this.selectedid
        }
      });
      const tmp_datax = tmp_data.data[0];
      this.contractDefaultSelected = tmp_datax.contractId;
      this.contractName = tmp_datax.contractName;
      this.HetongClient = tmp_datax.contractClient;
      this.HetongJine = tmp_datax.contractExpense;
      this.receiptTypeSelected = tmp_datax.receiptType;
      this.receiptNum = tmp_datax.receiptNum;
      this.receiptTax = tmp_datax.receiptTax;
      if (tmp_datax.receiptMoneyIn) {
        this.receiptMoneyIn = tmp_datax.receiptMoneyIn;
      }
      this.receiptRemark = tmp_datax.receiptRemark;
      if (tmp_datax.receiptFile) {
        this.receiptfileList = tmp_datax.receiptFile.split("/");
      }
      if (tmp_datax.receiptDate) {
        this.receiptDate = moment(tmp_datax.receiptDate, "YYYY-MM-DD");
      }
      if (tmp_datax.receiptInDate) {
        this.receiptInDate = moment(tmp_datax.receiptInDate, "YYYY-MM-DD");
      }
      this.spinning = false;
    },
    async downloadFile(item) {
      const tmp_data = await request.get("/common/getreceipt", {
        params: {
          postfilename: item
        }
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/getreceipt",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8"
        },
        responseType: "blob",
        params: {
          postfilename: item
        }
      }).then(response => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
    filterOptionWithID(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleChangeWithName(value) {
      this.contractDefaultSelected = value;
      this.contractInfoDetail(value);
    },
    handleChangeWithID(value) {
      this.contractDefaultSelected = value;
      this.contractInfoDetail(value);
    },
    contractInfoDetail(value) {
      const contractInfo = [...this.contractInfo];
      const target = contractInfo.find(item => item.index == value);
      if (target) {
        this.HetongClient = target.HetongClient;
        this.HetongJine = target.HetongJine;
      }
    },
    /*文件操作开始 */
    deleteSelectItem(item) {
      const index = this.receiptfileList.indexOf(item);
      const newFileList = this.receiptfileList.slice();
      newFileList.splice(index, 1);
      this.receiptfileList = newFileList;
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
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append("myfile", file);
      });
      formData.append("id", this.selectedid);
      let existedFileStr = "";
      if (this.receiptfileList.length != 0) {
        for (let i = 0; i < this.receiptfileList.length; i++) {
          existedFileStr += this.receiptfileList[i] + "\/";
        }
        existedFileStr = existedFileStr.slice(0, existedFileStr.length - 1);
      }
      formData.append("existedFiles", existedFileStr);
      this.uploading = true;
      axios
        .post(GLOBAL.env_file + "/receipt/uploadreceiptfile", formData)
        .then(res => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            // this.initProjectDetail();
            this.fileList = [];
            this.getReceiptdetail();
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    /*文件操作结束 */
    receiptTypeSelectiton(value) {
      this.receiptTypeSelected = value;
    },
    cancelReceiptModify() {
      this.$emit("closeThis");
    },
    confirmReceiptModify() {
      if (this.receiptDate == "") {
        this.$message.error("开票日期为必填");
        return;
      }
      if (this.receiptNum == "") {
        this.$message.error("发票编号为必填");
        return;
      }
      if (this.receiptTax == "") {
        this.$message.error("发票金额为必填");
        return;
      }
      if (this.receiptTypeSelected == "") {
        this.$message.error("请选择发票类型");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("contractid", this.contractDefaultSelected);
      postParams.append(
        "receiptdate",
        moment(this.receiptDate).format("YYYY-MM-DD")
      );
      postParams.append("receipttype", this.receiptTypeSelected);
      postParams.append("receiptnum", this.receiptNum);
      postParams.append("receipttax", this.receiptTax);
      postParams.append("receiptremark", this.receiptRemark);
      postParams.append(
        "userid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      postParams.append("id", this.selectedid);
      postParams.append(
        "receiptindate",
        moment(this.receiptInDate).format("YYYY-MM-DD")
      );
      postParams.append("receiptinmoney", this.receiptMoneyIn);
      axios
        .post(GLOBAL.env + "/receipt/modifyreceiptinfo", postParams)
        .then(res => {
          if (res.data[0].result === "success") {
            this.$message.success("修改发票成功");
            if (this.fileList.length) {
              this.handleUpload();
            } else {
              let postParams2 = new URLSearchParams();
              let existedFileStr = "";
              if (this.receiptfileList.length != 0) {
                for (let i = 0; i < this.receiptfileList.length; i++) {
                  existedFileStr += this.receiptfileList[i] + "\/";
                }
                existedFileStr = existedFileStr.slice(
                  0,
                  existedFileStr.length - 1
                );
              }
              postParams2.append("existedFiles", existedFileStr);
              postParams2.append("Id", this.selectedid);
              axios
                .post(GLOBAL.env + "/receipt/modifyfilewithoutnew", postParams2)
                .then(res => {
                  if (res.data === "success") {
                    this.$message.success("文件修改成功");
                    this.getReceiptdetail();
                  }
                });
            }
          } else {
            this.$message.warning("修改发票失败");
          }
        });
    }
  },
  mounted: function() {
    this.getContractInfo();
    this.getReceiptdetail();
  }
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
