<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="合同编号">
            <a-input
              placeholder="合同编号"
              :disabled="disableEdit"
              v-model="contractId"
            />
          </a-descriptions-item>
          <a-descriptions-item label="合同名称">
            <a-input
              placeholder="合同名称"
              :disabled="disableEdit"
              v-model="contractName"
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
          <a-descriptions-item label="开票日期">
            <a-badge dot>
              <a-date-picker
                style="width:100%"
                :disabled="disableEdit"
                v-if="receiptDate"
                :value="receiptDate"
              />
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="发票类型">
            <a-input
              placeholder="发票类型"
              :disabled="disableEdit"
              v-model="receiptType"
            />
          </a-descriptions-item>
          <a-descriptions-item label="发票号码">
            <a-input
              placeholder="发票号码"
              v-model="receiptNum"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="发票含税金额(元)">
            <a-input
              placeholder="发票含税金额"
              v-model="receiptTax"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="收款日期">
            <a-date-picker
              style="width:100%"
              :disabled="disableEdit"
              v-if="receiptDate"
              :value="receiptInDate"
            />
          </a-descriptions-item>
          <a-descriptions-item label="收款金额(元)">
            <a-input
              placeholder="收款金额"
              v-model="receiptMoneyIn"
              :disabled="disableEdit"
            />
          </a-descriptions-item>
          <a-descriptions-item label="发票备注" :span="2">
            <a-input
              placeholder="发票备注"
              v-model="receiptRemark"
              :disabled="disableEdit"
            />
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
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../../utils/global_variable";
import moment from "moment";
export default {
  props: ["selectedid"],
  data() {
    return {
      disableEdit: true,
      contractId: "",
      contractName: "",
      HetongClient: "",
      HetongJine: "",
      receiptType: "",
      receiptNum: "",
      receiptTax: "",
      receiptRemark: "",
      receiptInDate: "",
      receiptDate: "",
      receiptMoneyIn: "",
      receiptfileList: [],
      spinning: false
    };
  },
  methods: {
    moment,
    async getReceiptdetail() {
      this.spinning = true;
      const tmp_data = await request.get("/receipt/getdetailreceipt", {
        params: {
          id: this.selectedid
        }
      });
      const tmp_datax = tmp_data.data[0];
      this.contractId = tmp_datax.contractNum;
      this.contractName = tmp_datax.contractName;
      this.HetongClient = tmp_datax.contractClient;
      this.HetongJine = tmp_datax.contractExpense;
      this.receiptType = "";
      if (tmp_datax.receiptType == 1) {
        this.receiptType = "专票";
      }
      if (tmp_datax.receiptType == 2) {
        this.receiptType = "普票";
      }
      this.receiptNum = tmp_datax.receiptNum;
      this.receiptTax = tmp_datax.receiptTax;
      this.receiptMoneyIn = tmp_datax.receiptMoneyIn;
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
    }
  },
  mounted: function() {
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
