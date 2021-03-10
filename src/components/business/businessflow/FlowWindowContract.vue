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
        title="合同管理"
      />
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
          :pagination="false"
          :loading="loading"
        >
          <span slot="XMState"> <a-badge status="success" />Finished </span>
        </a-table>
      </a-table>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../utils/global_variable";
const columns = [
  { title: "合同编号", dataIndex: "contractID", key: "name" },
  { title: "合同名称", dataIndex: "contractName", key: "platform", width: 250 },
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
    dataIndex: "contractDelete",
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
export default {
  data() {
    return {
      data: null,
      columns,
      innerColumns,
      pagination_setting,
      loading: false,
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
    viewItem(item) {},
    editItem(item) {},
    deleteItem(item) {},
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
