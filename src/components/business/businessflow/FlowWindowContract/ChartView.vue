<template>
  <div>
    <div>
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="合同金额">
          {{ contractValue }}
        </a-descriptions-item>
        <a-descriptions-item label="结算金额">
          {{ caculateAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="项目产值">
          {{ projectsValue }}
        </a-descriptions-item>
        <a-descriptions-item label="缴款金额">
          {{ amountReceivable }}
        </a-descriptions-item>
        <a-descriptions-item label="开票金额">
          {{ receiptAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="已收金额">
          {{ paidInAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="余款">
          {{ restAmount }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="downloadJSD" type="primary">
          结算单下载
        </a-button>
      </div>
    </div>
    <div class="chartContainer">
      <ve-histogram
        :data="chartData"
        :settings="chartSettings"
        :events="chartEvents"
      ></ve-histogram>
    </div>
  </div>
</template>

<script>
import * as VeHistogram from "v-charts/lib/histogram";
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
export default {
  components: { VeHistogram },
  props: ["selectid"],
  data() {
    return {
      chartData: {
        columns: ["type", "cost"],
        rows: [],
      },
      chartDetail: [],
      chartSettings: {
        legendName: { cost: "金额" },
      },
      chartEvents: {},
      contractValue: 0, //合同金额
      caculateAmount: 0, //结算金额
      projectsValue: 0, //应收金额
      amountReceivable: 0, //缴款金额
      receiptAmount: 0, //开票金额
      restAmount: 0, //余款
      paidInAmount: 0, //已收金额
    };
  },
  methods: {
    async getContractFincialInfo() {
      const tmp_data = await request.get(
        "/contractmanagement/contractfinacialinfo",
        {
          params: {
            hetongid: this.selectid,
          },
        }
      );
      this.chartData.rows = tmp_data.data;
      tmp_data.data.forEach((element) => {
        switch (element.type) {
          case "合同金额":
            this.contractValue = element.cost;
            break;
          case "结算金额":
            this.caculateAmount = element.cost;
            break;
          case "项目产值":
            this.projectsValue = element.cost;
            break;
          case "缴款已收":
            this.amountReceivable = element.cost;
            break;
          case "开票金额":
            this.receiptAmount = element.cost;
            break;
          case "已收金额":
            this.paidInAmount = element.cost;
            break;
        }
      });
      this.restAmount = this.caculateAmount - this.paidInAmount;
    },
    async downloadJSD() {
      axios({
        url: GLOBAL.env + "/relatedfiles/jsd",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          hetongid: this.selectid,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", this.selectid + ".xlsx");
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
  },
  mounted() {
    this.chartData.rows = this.chartDetail;
    this.getContractFincialInfo();
  },
};
</script>
<style lang="scss">
.chartContainer {
  margin-top: 20px;
}
</style>
