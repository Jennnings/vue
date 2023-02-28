<template>
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
                style="width:100%"
                :disabled="disableEdit"
                :value="applicationDate"
              />
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="发票类型">
            <!-- <a-input placeholder="发票类型" /> -->
            <!-- <a-select placeholder="发票类型" style="width: 100%">
              <a-select-option v-for="item in receiptType" :key="item.index">
                {{ item.value }}
              </a-select-option>
            </a-select> -->
            <a-input
              placeholder="发票类型"
              :disabled="disableEdit"
              v-model="receiptType"
            />
          </a-descriptions-item>
          <a-descriptions-item label="开票金额含税（元）">
            <a-input
              placeholder="开票金额含税（元）"
              v-model="receiptNum"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="发票抬头">
            <a-input
              placeholder="发票抬头"
              v-model="receiptTitle"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <!-- <a-descriptions-item label="项目名称">
            <a-input placeholder="项目名称" />
          </a-descriptions-item> -->
          <a-descriptions-item label="税号">
            <a-input
              placeholder="税号"
              v-model="taxNum"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="开户行" :span="2">
            <a-input
              placeholder="开户行"
              v-model="bankName"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="账号">
            <a-input
              placeholder="账号"
              v-model="bankAccount"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="地址、联系电话" :span="2">
            <a-input
              placeholder="地址、联系电话"
              v-model="addTel"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="项目名称" :span="2">
            <a-input
              placeholder="地址、联系电话"
              v-model="relatedProjectName"
              :disabled="disableEdit"
            />
            <!--            
            <a-select mode="tags" style="width: 100%" :disabled="disableEdit">
              <a-select-option
                v-for="project in projectData"
                :key="project.Projectsn"
              >
                {{ project.ProjectName }}
              </a-select-option>
            </a-select> -->
          </a-descriptions-item>
          <a-descriptions-item label="地点" :span="2">
            <a-input
              placeholder="地点"
              v-model="mLocation"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="文件列表" :span="2">
            <div class="supportMaterials">
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
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-spin>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../../utils/global_variable";
import moment from "moment";
export default {
  props: ["applicationinfo"],
  data() {
    return {
      receiptType: "",
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
    moment,
    async initApplicationInfo() {
      this.spinning = true;
      axios
        .get(GLOBAL.env + "/receipt/initapplicationinfo", {
          params: { invoicesn: this.applicationinfo }
        })
        .then(res => {
          //console.log("222", res.data[0]);
          this.HetongNum = res.data[0].contractNum;
          this.HetongName = res.data[0].contractName;
          this.HetongClient = res.data[0].clientName;
          this.HetongJine = res.data[0].contractJine;
          this.applicationDate = moment(res.data[0].mInvoiceDate, "YYYY-MM-DD");
          if (res.data[0].mReceiptType == 1) {
            this.receiptType = "专票";
          } else {
            this.receiptType = "普票";
          }
          this.receiptNum = res.data[0].mReceiptNum;
          this.receiptTitle = res.data[0].mReceiptTitle;
          this.taxNum = res.data[0].mTaxNum;
          this.bankName = res.data[0].mBankName;
          this.bankAccount = res.data[0].mBankAccount;
          this.addTel = res.data[0].mAddTel;
          this.relatedProjectName = res.data[0].mProjectName;
          this.mLocation = res.data[0].mLocation;
          if (res.data[0].mInvoiceApplicationFiles) {
            this.supportFileList = res.data[0].mInvoiceApplicationFiles.split(
              ","
            );
          }

          this.spinning = false;
        });
    },
    async downloadFile(item) {
        const tmp_data = await request.get("/common/downloadinvoiceapplication", {
        params: {
          postfilename: item
        }
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/downloadinvoiceapplication",
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
    }
    
  },
  mounted: function() {
    this.initApplicationInfo();
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
