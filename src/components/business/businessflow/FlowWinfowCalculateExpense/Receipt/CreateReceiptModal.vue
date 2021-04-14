<template>
  <div>
    <div>
      <div class="projectInfo">
        <a-descriptions :column="2" bordered size="small">
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
              <a-date-picker @change="onReceiptDateChange" style="width:100%" />
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="发票类型">
            <!-- <a-input placeholder="发票类型" /> -->
            <a-select
              placeholder="发票类型"
              style="width: 100%"
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
          <!-- <a-descriptions-item label="项目名称">
            <a-input placeholder="项目名称" />
          </a-descriptions-item> -->
          <a-descriptions-item label="发票备注" :span="2">
            <a-input placeholder="发票备注" v-model="receiptRemark" />
          </a-descriptions-item>
          <a-descriptions-item label="文件列表" :span="2">
            <div class="supportMaterials">
              <!-- <a-list
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
              </a-list> -->
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
          <a-button @click="cancelReceiptCreate">
            取消
          </a-button>
        </div>
        <div class="singlebutton">
          <a-button type="primary" @click="confirmReceiptCreate">
            确认
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../../utils/global_variable";
const receiptType = [
  {
    index: 1,
    value: "专票",
  },
  {
    index: 2,
    value: "普票",
  },
];
export default {
  data() {
    return {
      receiptType,
      contractDefaultSelected: "",
      contractInfo: [],
      distoryThis: true,
      disableEdit: true,
      fileList: [],
      supportFileList: [],
      uploading: false,
      HetongClient: "",
      HetongJine: "",
      receiptDate: "",
      receiptTypeSelected: "",
      receiptNum: "",
      receiptTax: "",
      receiptRemark: "",
    };
  },
  methods: {
    /*合同操作开始 */
    async getContractInfo() {
      const tmpdata = await request.get("/common/getcontractinfo");
      this.contractInfo = tmpdata.data;
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
      const target = contractInfo.find((item) => item.index == value);
      if (target) {
        this.HetongClient = target.HetongClient;
        this.HetongJine = target.HetongJine;
      }
    },
    /*合同操作结束 */
    onReceiptDateChange(date, dateString) {
      this.receiptDate = dateString;
    },
    receiptTypeSelectiton(value) {
      this.receiptTypeSelected = value;
    },
    /*文件操作开始 */
    deleteSelectItem(item) {
      const index = this.supportFileList.indexOf(item);
      const newFileList = this.supportFileList.slice();
      newFileList.splice(index, 1);
      this.supportFileList = newFileList;
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
    handleUpload(id) {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      formData.append("id", id);
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
        .post(GLOBAL.env + "/receipt/uploadreceiptfile", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            // this.initProjectDetail();
            this.fileList = [];
            this.$emit("closeThis");
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    /*文件操作结束 */
    cancelReceiptCreate() {
      //console.log("close modal");
      this.$emit("closeThis");
    },
    confirmReceiptCreate() {
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
      postParams.append("receiptdate", this.receiptDate);
      postParams.append("receipttype", this.receiptTypeSelected);
      postParams.append("receiptnum", this.receiptNum);
      postParams.append("receipttax", this.receiptTax);
      postParams.append("receiptremark", this.receiptRemark);
      postParams.append(
        "userid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      axios
        .post(GLOBAL.env + "/receipt/createreceipt", postParams)
        .then((res) => {
          if (res.data[0].result === "success") {
            this.$message.success("新建发票成功");
            if (this.fileList.length) {
              this.handleUpload(res.data[0].Id);
            }
          } else {
            this.$message.warning("新建发票失败");
          }
        });
    },
  },
  mounted: function() {
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
