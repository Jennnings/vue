<template>
  <div class="contianer">
    <div class="titlebar">
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240);
        height:50px;
        padding-top:10px;
        padding-left:10px;
        font-weight:
        "
        title="财务统计"
      />
    </div>
    <div class="toolbar">
      <div class="itemRight">
        <a-button
          type="primary"
          icon="file-add"
          style="width:110px"
          @click="createReceipt"
        >
          新增发票
        </a-button>
      </div>
    </div>
    <div class="table_contianer">
      <a-table
        :columns="columns"
        :data-source="receiptData"
        :pagination="pagination_setting"
        :loading="spinning"
        style="margin-top:10px"
        rowKey="id"
      >
        <a slot="name" slot-scope="text" @click="clickforInfo(text)">{{
          text
        }}</a>
        <span slot="customTitle"><a-icon type="tags" /> 发票编号</span>
        <span slot="tags" slot-scope="tags">
          <a-tag color="green" v-if="tags === 1">
            专票
          </a-tag>
          <a-tag color="red" v-if="tags === 2">
            普票
          </a-tag>
        </span>
        <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)"
          >查看</a
        >
        <a slot="edit" slot-scope="item" @click="edititem(item)">编辑</a>
        <span slot="delete" slot-scope="item" @click="deleteClick(item)">
          <a>删除</a>
        </span>
      </a-table>
    </div>
    <a-modal
      v-model="createReceiptVisible"
      title="新建发票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateReceiptModal @closeThis="closeFrontModal"></CreateReceiptModal>
    </a-modal>
    <a-modal
      v-model="receiptDetailVisible"
      title="查看发票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewReceiptDetail :selectedid="selectedReceipt"></ViewReceiptDetail>
    </a-modal>
    <a-modal
      v-model="receiptEditVisible"
      title="修改发票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      @cancel="closeModal"
    >
      <EditReceiptModal
        :selectedid="selectedReceipt"
        @closeThis="closeFrontModal"
      ></EditReceiptModal>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../utils/global_variable";
import axios from "axios";
import CreateReceiptModal from "./../businessflow/FlowWinfowCalculateExpense/Receipt/CreateReceiptModal";
import ViewReceiptDetail from "./../businessflow/FlowWinfowCalculateExpense/Receipt/ViewReceiptDetail";
import EditReceiptModal from "./../businessflow/FlowWinfowCalculateExpense/Receipt/EditReceiptModal";
const columns = [
  {
    dataIndex: "receiptNum",
    key: "receiptNum",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150,
  },
  {
    title: "发票含税金额(元)",
    dataIndex: "receiptTax",
    key: "receiptTax",
    width: 150,
  },
  {
    title: "发票类型",
    key: "receiptType",
    dataIndex: "receiptType",
    scopedSlots: { customRender: "tags" },
    width: 100,
  },
  {
    title: "合同编号",
    dataIndex: "contractid",
    key: "contractid",
    width: 150,
  },
  {
    title: "发票文件",
    key: "receiptFile",
    dataIndex: "receiptFile",
    width: 150,
  },
  {
    title: "查看",
    key: "viewdetail",
    dataIndex: "receiptId",
    scopedSlots: { customRender: "viewdetail" },
    width: 50,
  },
  {
    title: "编辑",
    key: "edit",
    dataIndex: "receiptId",
    scopedSlots: { customRender: "edit" },
    width: 50,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "receiptId",
    scopedSlots: { customRender: "delete" },
    width: 50,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    CreateReceiptModal,
    ViewReceiptDetail,
    EditReceiptModal,
  },
  data() {
    return {
      columns,
      pagination_setting,
      receiptData: [],
      spinning: false,
      createReceiptVisible: false,
      distoryThis: true,
      selectedReceipt: "",
      receiptDetailVisible: false,
      receiptEditVisible: false,
    };
  },
  methods: {
    async getReceipts() {
      this.spinning = true;
      const tmp_data = await request.get("/receipt/getreceipt");
      this.receiptData = tmp_data.data;
      this.spinning = false;
    },
    createReceipt() {
      this.createReceiptVisible = true;
    },
    closeFrontModal() {
      this.createReceiptVisible = false;
      this.receiptEditVisible = false;
      this.getReceipts();
    },
    closeModal() {
      this.getReceipts();
    },
    deleteClick(item) {
      console.log(item);
      let postParams = new URLSearchParams();
      let that = this;
      this.$confirm({
        title: "确定删除该发票?",
        content: "删除发票将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          //执行删除操作
          if (item) {
            postParams.append("id", item);
            axios
              .post(GLOBAL.env + "/receipt/deletereceipt", postParams)
              .then((res) => {
                if (res.data === "success") {
                  that.$message.success("删除成功");
                  that.getReceipts();
                } else {
                  that.$message.error("删除失败");
                }
              });
          }
        },
      });
    },
    edititem(item) {
      //receiptEditVisible
      this.receiptEditVisible = true;
      this.selectedReceipt = item;
    },
    viewdetail(item) {
      this.receiptDetailVisible = true;
      this.selectedReceipt = item;
    },
  },
  mounted: function() {
    this.getReceipts();
  },
};
</script>
<style lang="scss">
.contianer {
  padding: 3px 20px 20px 20px;
  display: flex;
  min-width: 1700px;
  flex-direction: column;
  .titlebar {
    height: fit-content;
    width: 100%;
    // background: blue;
  }
  .toolbar {
    height: 40px;
    width: 100%;
    //background: #eeeeee;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .itemLeft {
      .itemName {
        float: left;
        font-family: "微软雅黑";
        font-size: 15px;
        margin-left: 12px;
      }
    }
    .itemRight {
      margin-right: 20px;
      .itemName {
        float: left;
        font-family: "微软雅黑";
        font-size: 15px;
        margin-left: 12px;
      }
    }
  }
  .table_contianer {
    height: 100%;
    width: 100%;
    margin-top: 5px;
    //user-select: none;
  }
  // .ant-select-sm .ant-select-selection--single {
  //   height: 32px;
  // }
  // .ant-select-sm .ant-select-selection__rendered {
  //   margin-top: 5px;
  // }
}
</style>
