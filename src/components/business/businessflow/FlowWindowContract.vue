<template>
  <div class="contianer">
    <div class="titlebar">
      <a-page-header class="pageHeader" title="合同管理">
        <template slot="extra">
          <a-button
            type="primary"
            icon="file-add"
            style="width:110px;margin-right: 40px;background: #1890ff;"
            @click="createContract"
          >
            新建合同</a-button
          >
        </template>
      </a-page-header>
    </div>
    <div class="toolbar">
      <div class="itemLeft">
        <div class="itemName">
          <span>合同编号:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="合同编号"
            v-model="contractID"
          />
        </div>
        <div class="itemName">
          <span>合同(项目)名称:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="合同(项目)名称"
            v-model="contractName"
          />
        </div>
        <div class="itemName">
          <span>乙方(委托)单位:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="乙方(委托)单位"
            v-model="contractClient"
          />
        </div>
        <div class="itemName">
          <span>代建单位:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="代建单位"
            v-model="contractAssistCompany"
          />
        </div>
        <div class="itemName">
          <span>起止时间:</span>
          <a-date-picker @change="onstartDateChange" style="margin-left:10px" />
          <span style="margin-left:10px">~</span>
          <a-date-picker @change="onendDateChange" style="margin-left:10px" />
        </div>
        <div class="itemName">
          <a-button
            type="primary"
            icon="search"
            style="width:110px"
            @click="queryClicked"
          >
            项目查询
          </a-button>
        </div>
      </div>
    </div>
    <div class="table_contianer" v-if="data">
      <a-table
        :columns="columns"
        :data-source="data"
        class="components-table-demo-nested"
        :scroll="{ y: 800 }"
        rowKey="id"
        :pagination="pagination_setting"
        @expand="expandContract"
      >
        <span slot="contractView" slot-scope="item" @click="viewItem(item)">
          <a>查看</a>
        </span>
        <span slot="contractEdit" slot-scope="item" @click="editItem(item)">
          <a>编辑</a>
        </span>
        <span slot="contractDelete" slot-scope="item" @click="deleteItem(item)">
          <a>删除</a>
        </span>
        <template> </template>
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :data-source="record.innerDatax"
          :loading="loading"
          :pagination="pagination_setting_inner"
        >
          <span slot="XMState"> <a-badge status="success" />Finished </span>
        </a-table>
      </a-table>
    </div>
    <a-modal
      v-model="createContractVisible"
      title="新建合同"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateContract @childFn="parentFn" />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../utils/global_variable";
import CreateContract from "./FlowWindowContract/CreateContract";
import { message } from "ant-design-vue";
const columns = [
  { title: "合同编号", dataIndex: "contractID", key: "name", with: 80 },
  { title: "合同名称", dataIndex: "contractName", key: "platform", width: 300 },
  { title: "合同签订时间", dataIndex: "contractSignTime", key: "version" },
  { title: "乙方（委托）单位", dataIndex: "contractClient", key: "upgradeNum" },
  { title: "代建单位", dataIndex: "contractAssistCompany", key: "creator" },
  {
    title: "查看",
    dataIndex: "contractView",
    key: "contractView",
    scopedSlots: { customRender: "contractView" },
  },
  {
    title: "编辑",
    dataIndex: "contractEdit",
    key: "contractEdit",
    scopedSlots: { customRender: "contractEdit" },
  },
  {
    title: "删除",
    dataIndex: "Id",
    key: "contractDelete",
    scopedSlots: { customRender: "contractDelete" },
  },
];

const innerColumns = [
  { title: "项目登记号", dataIndex: "projectsn", key: "projectsn", width: 200 },
  {
    title: "项目名称",
    dataIndex: "projectname",
    key: "projectname",
    width: 200,
  },
  {
    title: "项目状态",
    key: "XMState",
    scopedSlots: { customRender: "XMState" },
    width: 200,
  },
];
const pagination_setting = {
  defaultPageSize: 8,
};
const pagination_setting_inner = {
  defaultPageSize: 5,
};
export default {
  components: {
    CreateContract,
  },
  data() {
    return {
      data: null,
      columns,
      innerColumns,
      pagination_setting,
      pagination_setting_inner,
      loading: false,
      sDate: "",
      eDate: "",
      contractID: "",
      contractName: "",
      contractClient: "",
      contractAssistCompany: "",
      createContractVisible: false,
      distoryThis: true,
    };
  },
  methods: {
    async getContract() {
      const tmp_data = await request.get("/contractmanagement/getcontract");
      this.data = tmp_data.data;
    },
    //展开面板时使用 函数名称需要修改
    expandContract(item, record) {
      console.log(item, record);
      this.loading = true;
      axios
        .get(GLOBAL.env + "/contractmanagement/queryProjectByHeTong", {
          params: { contractID: record.contractID },
        })
        .then((res) => {
          record["innerDatax"] = res.data;
          this.loading = false;
        });
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    async queryClicked() {
      console.log("合同编号", this.contractID);
      console.log("合同名称", this.contractName);
      console.log("委托单位", this.contractClient);
      console.log("代建单位", this.contractAssistCompany);
      console.log("开始时间", this.sDate);
      console.log("终止时间", this.eDate);
      const tmp_data = await request.get("/contractmanagement/querycontract", {
        params: {
          contractnum: this.contractID,
          contractname: this.contractName,
          contractclient: this.contractClient,
          contractcompany: this.contractAssistCompany,
          sDate: this.sDate,
          eDate: this.eDate,
        },
      });
      this.data = tmp_data.data;
    },
    viewItem(item) {},
    editItem(item) {},
    deleteItem(item) {
      let postParams;
      let that = this;
      this.$confirm({
        title: "确定删除该项目?",
        content: "删除项目将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          //执行删除操作
          if (item) {
            console.log("item", item);
            postParams = new URLSearchParams();
            postParams.append("deleteid", item);
            axios
              .post(
                GLOBAL.env + "/contractmanagement/deletecontract",
                postParams
              )
              .then((res) => {
                if (res.data === "success") {
                  that.$message.success("删除成功");
                  that.getContract();
                }
                if (res.data === "error has project") {
                  that.$message.error("合同包含子项目，无法删除");
                }
              });
          }
          console.log(item);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    createContract() {
      this.createContractVisible = true;
    },
    parentFn() {
      this.createContractVisible = false;
    },
  },
  mounted: function() {
    this.getContract();
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

    .pageHeader {
      border: 1px solid rgb(235, 237, 240);
      height: 50px;
      padding-top: 10px;
      padding-left: 10px;
    }
    .createButtonContainer {
    }
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
    }
  }
  .table_contianer {
    height: 100%;
    width: 100%;
    margin-top: 5px;
    //user-select: none;
    overflow-y: auto;
  }
}
</style>
