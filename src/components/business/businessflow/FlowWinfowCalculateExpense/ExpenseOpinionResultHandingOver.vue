<template>
  <div>
    <a-button type="primary" @click="createHandingInfo">
      创建交接内容
    </a-button>
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
      <span slot="customTitle"><a-icon type="tags" /> 交接信息编号</span>
      <span slot="isChecked" slot-scope="isChecked">
        <a-icon
          v-if="isChecked"
          type="check-circle"
          theme="twoTone"
          two-tone-color="#52c41a"
        />
        <a-icon
          v-if="!isChecked"
          type="close-circle"
          theme="twoTone"
          two-tone-color="red"
        />
      </span>
      <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)">查看</a>
      <a slot="edit" slot-scope="item" @click="edititem(item)">编辑</a>
      <span slot="delete" slot-scope="item" @click="deleteClick(item)">
        <a>删除</a>
      </span>
      <span slot="printInfo" slot-scope="item" @click="printHandingInfo(item)">
        <a>打印</a>
      </span>
    </a-table>
    <a-modal
      v-model="createHandingInfoVisible"
      title="创建交接内容"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      :footer="null"
      width="1300px"
    >
      <CreateHandingMaterial :projectInfo="projectInfo" />
    </a-modal>
    <a-modal
      v-model="viewHandingInfoVisible"
      title="查看交接内容"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      :footer="null"
      width="1300px"
    >
      <ViewHandingMaterial :projectInfo="selectedRecord" />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
import CreateHandingMaterial from "./CreateHandingMaterial";
import ViewHandingMaterial from "./ViewHandingMaterial";
const columns = [
  {
    dataIndex: "handingsn",
    key: "handingsn",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150,
  },
  {
    title: "接收人",
    dataIndex: "handingman",
    key: "handingman",
    width: 100,
  },
  {
    title: "接收人电话",
    key: "handingmanphone",
    dataIndex: "handingmanphone",
    // scopedSlots: { customRender: "tags" },
    width: 100,
  },
  {
    title: "交接材料",
    dataIndex: "handingmaterial",
    key: "handingmaterial",
    width: 150,
  },
  {
    title: "交接时间",
    key: "handingtime",
    dataIndex: "handingtime",
    width: 150,
  },
  {
    title: "公章",
    key: "isSealed",
    dataIndex: "isSealed",
    scopedSlots: { customRender: "isChecked" },
    width: 50,
  },
  {
    title: "价格",
    key: "isPrice",
    dataIndex: "isPrice",
    scopedSlots: { customRender: "isChecked" },
    width: 50,
  },
  {
    title: "归还",
    key: "isReturn",
    dataIndex: "isReturn",
    scopedSlots: { customRender: "isChecked" },
    width: 50,
  },
  // {
  //   title: "查看",
  //   key: "viewdetail",
  //   dataIndex: "handingsn",
  //   scopedSlots: { customRender: "viewdetail" },
  //   width: 50,
  // },
  {
    title: "编辑",
    key: "edit",
    dataIndex: "handingsn",
    scopedSlots: { customRender: "edit" },
    width: 50,
  },
  {
    title: "打印",
    key: "printInfo",
    dataIndex: "handingsn",
    scopedSlots: { customRender: "printInfo" },
    width: 50,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "handingsn",
    scopedSlots: { customRender: "delete" },
    width: 50,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  props: ["projectInfo"],
  components: {
    CreateHandingMaterial,
    ViewHandingMaterial,
    // ViewReceiptDetail,
    // EditReceiptModal,
  },
  data() {
    return {
      columns,
      pagination_setting,
      receiptData: [],
      spinning: false,
      createHandingInfoVisible: false,
      distoryThis: true,
      selectedRecord: "",
      receiptDetailVisible: false,
      receiptEditVisible: false,
      authorith_Add: false,
      authorith_Browse: false,
      authorith_Delete: false,
      authorith_Edit: false,
      authorith_Grant: false,
      viewHandingInfoVisible: false,
    };
  },
  methods: {
    async getReceipts() {
      this.spinning = true;
      const tmp_data = await request.get("/resulthanding/inithandinginfo", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      this.receiptData = tmp_data.data;
      this.spinning = false;
    },
    createHandingInfo() {
      this.createHandingInfoVisible = true;
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
    printHandingInfo() {},
    clickforInfo(item) {
      this.viewHandingInfoVisible = true;
      this.selectedRecord = item;
    },
  },
  mounted: function() {
    this.getReceipts();
  },
};
</script>
<style lang="scss"></style>
