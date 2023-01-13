<template>
  <div>
    <a-button type="primary" @click="createInvoice">
      申请开票
    </a-button>
    <a-table
      :columns="columns"
      :data-source="inVoiceData"
      :pagination="pagination_setting"
      :loading="spinning"
      style="margin-top:10px"
      rowKey="id"
    >
      <a slot="name" slot-scope="text" @click="clickforInfo(text)">{{
        text
      }}</a>
      <span slot="customTitle"><a-icon type="tags" />申请编号</span>
      <span slot="tags" slot-scope="tags">
        <a-tag color="green" v-if="tags === 1">
          专票
        </a-tag>
        <a-tag color="red" v-if="tags === 2">
          普票
        </a-tag>
      </span>
      <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)">查看</a>
      <a slot="edit" slot-scope="item" @click="edititem(item)">编辑</a>
      <a slot="print" slot-scope="item" @click="printApplication(item)">打印</a>
      <span slot="delete" slot-scope="item" @click="deleteClick(item)">
        <a>删除</a>
      </span>
    </a-table>
    <a-modal
      v-model="createReceiptVisible"
      title="新建开票申请"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateReceiptModalForContract
        @closeThis="closeFrontModal"
        :contractinfo="contractinfo"
      ></CreateReceiptModalForContract>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "../../../../../utils/global_variable";
import moment from "moment";
import CreateReceiptModalForContract from "./CreateInvoiceModalForContract.vue";
const columns = [
  {
    dataIndex: "invoiceSn",
    key: "invoiceSn",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150
  },
  {
    title: "开票项目",
    dataIndex: "projectName",
    key: "projectName",
    width: 150
  },
  {
    title: "开票金额（含税）",
    dataIndex: "receiptNum",
    key: "receiptNum",
    width: 150
  },
  {
    title: "发票类型",
    key: "receiptType",
    dataIndex: "receiptType",
    scopedSlots: { customRender: "tags" },
    width: 100
  },
  {
    title: "申请时间",
    dataIndex: "invoiceDate",
    key: "invoiceDate",
    width: 150
  },
  //   {
  //     title: "发票文件",
  //     key: "receiptFile",
  //     dataIndex: "receiptFile",
  //     width: 150,
  //   },
  {
    title: "查看",
    key: "viewdetail",
    dataIndex: "invoiceSn",
    scopedSlots: { customRender: "viewdetail" },
    width: 50
  },
  {
    title: "编辑",
    key: "edit",
    dataIndex: "invoiceSn",
    scopedSlots: { customRender: "edit" },
    width: 50
  },
  {
    title: "打印",
    key: "print",
    dataIndex: "invoiceSn",
    scopedSlots: { customRender: "print" },
    width: 50
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "invoiceSn",
    scopedSlots: { customRender: "delete" },
    width: 50
  }
];
const pagination_setting = {
  defaultPageSize: 10
};
export default {
  props: ["contractinfo"],
  components: {
    CreateReceiptModalForContract
  },
  data() {
    return {
      columns,
      pagination_setting,
      applicationDate: "",
      invoicedAmount: "",
      receiptType: "",
      recepitTiele: "",
      receiptTaxNum: "",
      bankName: "",
      bankAccount: "",
      addressTEL: "",
      projectName: "",
      contractName: "",
      contractId: "",
      applicationLocation: "",
      createReceiptVisible: false,
      receiptData: null,
      spinning: false,
      distoryThis: true,
      inVoiceData: null
    };
  },
  methods: {
    moment,
    async initInvoiceList() {
      const tmp_data = await request
        .get("/receipt/initinvoicelist/", {
          params: {
            mHetongID: this.contractinfo
          }
        })
        .then(res => {
          this.inVoiceData = res.data;
        });
    },
    createInvoice() {
      this.createReceiptVisible = true;
    },
    closeFrontModal() {},
    async printApplication(item) {
      axios({
        url: GLOBAL.env + "/relatedfiles/printapplicationsheet",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8"
        },
        responseType: "blob",
        params: {
          minvoicesn: item,
          userid: JSON.parse(sessionStorage.getItem("userToken")).UserID
        }
      }).then(response => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "kpsqd.xlsx");
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    }
  },
  mounted: function() {
    this.initInvoiceList();
  }
};
</script>
