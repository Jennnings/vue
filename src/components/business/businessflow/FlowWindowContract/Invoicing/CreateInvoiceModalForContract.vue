<template>
  <div>
    <div>
      <a-spin :spinning="spinning">
        <div class="projectInfo">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="合同编号">
              <a-input
                placeholder="合同编号"
                :disabled="disableEdit"
                v-model="HetongNum"
              />
            </a-descriptions-item>
            <a-descriptions-item label="合同名称">
              <a-input
                placeholder="合同名称"
                :disabled="disableEdit"
                v-model="HetongName"
              />
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
            <a-descriptions-item label="申请日期">
              <a-badge dot>
                <a-date-picker
                  @change="onApplicationDateChange"
                  style="width:100%"
                />
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
            <a-descriptions-item label="开票金额含税（元）">
              <a-input placeholder="开票金额含税（元）" v-model="receiptNum" />
            </a-descriptions-item>
            <a-descriptions-item label="发票抬头">
              <a-input placeholder="发票抬头" v-model="receiptTitle" />
            </a-descriptions-item>
            <!-- <a-descriptions-item label="项目名称">
            <a-input placeholder="项目名称" />
          </a-descriptions-item> -->
            <a-descriptions-item label="税号">
              <a-input placeholder="税号" v-model="taxNum" />
            </a-descriptions-item>
            <a-descriptions-item label="开户行" :span="2">
              <a-input placeholder="开户行" v-model="bankName" />
            </a-descriptions-item>
            <a-descriptions-item label="账号">
              <a-input placeholder="账号" v-model="bankAccount" />
            </a-descriptions-item>
            <a-descriptions-item label="地址、联系电话" :span="2">
              <a-input placeholder="地址、联系电话" v-model="addTel" />
            </a-descriptions-item>
            <a-descriptions-item label="项目名称" :span="2">
              <a-select mode="tags" style="width: 100%" @change="projectPicker">
                <a-select-option
                  v-for="project in projectData"
                  :key="project.Projectsn"
                >
                  {{ project.ProjectName }}
                </a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="地点" :span="2">
              <a-input placeholder="地点" v-model="mLocation" />
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
      </a-spin>
      <div class="buttonGtoup">
        <div class="singlebutton">
          <a-button @click="cancelReceiptCreate">
            取消
          </a-button>
        </div>
        <div class="singlebutton">
          <a-button type="primary" @click="confirmApplicationCreate">
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
import GLOBAL from "../../../../../utils/global_variable";
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
  props: ["contractinfo"],
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
      HetongName: "",
      HetongNum: "",
      applicationDate: "", //申请时间
      receiptTypeSelected: "", //发票类型
      receiptNum: "", //发票金额含税
      receiptTitle: "", //发票抬头
      taxNum: "", //税号
      bankName: "", //开户行名称
      bankAccount: "", //开户银行账号
      addTel: "", //地址联系电话
      mLocation: "", //地点
      relatedProjectName: "", //项目名称
      spinning: false,
      projectData: null
    };
  },
  methods: {
    /*获取创建开票申请基础数据 */
    async getContractInfoInit() {
      this.spinning = true;
      const tmp_data = await request.get("/receipt/initreceiptbycontract", {
        params: {
          contractid: this.contractinfo
        }
      });
      this.HetongNum = tmp_data.data[0].contractNum;
      this.HetongName = tmp_data.data[0].contractName;
      this.HetongJine = tmp_data.data[0].contractJine;
      this.HetongClient = tmp_data.data[0].clientName;
      const tmp_data_project = await request.get("/receipt/initprojectinfo", {
        params: {
          mHetongID: this.HetongNum
        }
      });
      this.projectData = tmp_data_project.data;
      this.spinning = false;
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
    /*合同操作结束 */
    onApplicationDateChange(date, dateString) {
      this.applicationDate = dateString;
    },
    onReceiptInDateChange(date, dateString) {
      this.receiptInDate = dateString;
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
      fileList.forEach(file => {
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
        .post(GLOBAL.env_file + "/receipt/uploadapplicationfile", formData)
        .then(res => {
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
    confirmApplicationCreate() {
      if (this.applicationDate == "") {
        this.$message.error("申请日期为必填");
        return;
      }
      if (this.receiptTypeSelected == "") {
        this.$message.error("请选择发票类型");
        return;
      }
      if (this.receiptNum == "") {
        this.$message.error("开票金额为必填");
        return;
      }
      if (this.receiptTitle == "") {
        this.$message.error("发票抬头为必填");
        return;
      }
      if (this.taxNum == "") {
        this.$message.error("税号为必填");
        return;
      }
      if (this.bankName == "") {
        this.$message.error("开户行为必填");
        return;
      }
      if (this.bankAccount == "") {
        this.$message.error("账号为必填");
      }
      if (this.addTel == "") {
        this.$message.error("地址联系电话为必填");
      }
      let postParams = new URLSearchParams();
      postParams.append("mApplicationDate", this.applicationDate);
      postParams.append("mReceiptTypeSelected", this.receiptTypeSelected);
      postParams.append("mReceiptNum", this.receiptNum);
      postParams.append("mReceiptTitle", this.receiptTitle);
      postParams.append("mTaxNum", this.taxNum);
      postParams.append("mBankName", this.bankName);
      postParams.append("mAddTel", this.addTel);
      postParams.append("mLocation", this.mLocation);
      postParams.append("mRelaterdProjectName", this.relatedProjectName);
      postParams.append("mBankAccount", this.bankAccount);
      postParams.append("mContractId", this.contractinfo);
      postParams.append(
        "mUserID",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      axios
        .post(GLOBAL.env + "/receipt/insertinvoiceapplication", postParams)
        .then(res => {
          if (res.data[0].result === "success") {
            this.$message.success("新建申请成功");
            if (this.fileList.length != 0) {
              console.log(this.fileList.length);
              this.handleUpload(res.data[0].Id);
            } else {
              this.$emit("closeThis");
            }
          } else {
            this.$message.warning("新建申请失败");
          }
        });
    },
    projectPicker(item) {
      this.relatedProjectName = "";
      item.forEach(Element => {
        this.projectData.forEach(Element2 => {
          if (Element2.Projectsn == Element) {
            this.relatedProjectName += Element2.ProjectName + ",";
          }
        });
      });
      // console.log(
      //   this.relatedProjectName.substring(0, this.relatedProjectName.length - 1)
      // );
      this.relatedProjectName = this.relatedProjectName.substring(
        0,
        this.relatedProjectName.length - 1
      );
    }
    // 确认开票信息
  },
  mounted: function() {
    this.getContractInfoInit();
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
