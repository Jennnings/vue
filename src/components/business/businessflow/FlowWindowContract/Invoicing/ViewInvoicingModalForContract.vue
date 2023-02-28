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
      <a slot="view" slot-scope="item" @click="viewdetail(item)">查看</a>
      <a slot="edit" slot-scope="item" @click="edititem(item)">编辑</a>
      <a slot="print" slot-scope="item" @click="printApplication(item)">打印</a>
      <span slot="delete" slot-scope="item" @click="deleteClick(item)">
        <a>删除</a>
      </span>
    </a-table>
    <a-modal
      v-model="createApplicationVisible"
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
    <a-modal
      v-model="viewApplicationVisible"
      title="查看开票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewInvoiceDetail :applicationinfo="applicationinfo"></ViewInvoiceDetail>
    </a-modal>
    <a-modal
      v-model="modifyApplicationVisible"
      title="修改开票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ModifyInvoiceModal
        @closeThis="closeModifyModal"
        :applicationinfo="applicationinfo"
      ></ModifyInvoiceModal>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "../../../../../utils/global_variable";
import moment from "moment";
import CreateReceiptModalForContract from "./CreateInvoiceModalForContract.vue";
import ViewInvoiceDetail from "./ViewInvoiceDetail.vue";
import ModifyInvoiceModal from "./ModifyInvoiceModal.vue";
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
    key: "view",
    dataIndex: "invoiceSn",
    scopedSlots: { customRender: "view" },
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
    CreateReceiptModalForContract,
    ViewInvoiceDetail,
    ModifyInvoiceModal
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
      createApplicationVisible: false,
      viewApplicationVisible: false,
      receiptData: null,
      spinning: false,
      distoryThis: true,
      inVoiceData: null,
      applicationinfo: "",
      modifyApplicationVisible: false
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
      this.createApplicationVisible = true;
    },
    closeFrontModal() {
      this.initInvoiceList();
      this.createApplicationVisible = false;
    },
    closeModifyModal() {
      this.modifyApplicationVisible = false;
    },
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
    },
    deleteClick(item) {
      console.log(item);
      let postParams = new URLSearchParams();
      let that = this;
      this.$confirm({
        title: "确定删除该申请?",
        content: "删除申请将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          //执行删除操作
          if (item) {
            postParams.append("invoicesn", item);
            axios
              .post(GLOBAL.env + "/receipt/deleteapplication", postParams)
              .then(res => {
                if (res.data === "success") {
                  that.$message.success("删除成功");
                  that.initInvoiceList();
                } else {
                  that.$message.error("删除失败");
                }
              });
          }
        }
      });
    },
    //查看开票申请
    viewdetail(item) {
      this.applicationinfo = item;
      this.viewApplicationVisible = true;
    },
    //编辑开票申请
    edititem(item) {
      this.applicationinfo = item;
      this.modifyApplicationVisible = true;
    }
  },
  mounted: function() {
    this.initInvoiceList();
  }
};
</script>
