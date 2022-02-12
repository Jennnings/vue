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
          <a-button
            type="primary"
            icon="file-add"
            style="width:110px;margin-right: 40px;background: #1890ff;"
            @click="viewReceipt"
          >
            查看发票</a-button
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
          <span>甲方(委托)单位:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="甲方(委托)单位"
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
            合同查询
          </a-button>
        </div>
      </div>
    </div>
    <!-- <a-spin :spinning="spinning"> -->
    <div class="table_contianer" v-if="data">
      <a-table
        :columns="columns"
        :data-source="data"
        class="components-table-demo-nested"
        :loading="spinning"
        rowKey="id"
        :pagination="pagination_setting"
        @expand="expandContract"
      >
        <!-- <a slot="contractname" slot-scope="text" @click="viewItem(text)">{{
          text
        }}</a> -->
        <span slot="isTotalPrice" slot-scope="isTotalPrice">
          <a-tag v-if="isTotalPrice" color="green">
            <span>总价合同</span>
          </a-tag>
          <a-tag v-if="!isTotalPrice" color="volcano">
            <span>分项收费</span>
          </a-tag>
          <!-- <a-icon
            v-if="isTotalPrice"
            type="check-circle"
            theme="twoTone"
            two-tone-color="#52c41a"
          />
          <a-icon
            v-if="!isTotalPrice"
            type="close-circle"
            theme="twoTone"
            two-tone-color="red"
          /> -->
        </span>
        <span slot="contractView" slot-scope="item" @click="viewItem(item)">
          <a>查看</a>
        </span>
        <span slot="contractEdit" slot-scope="item" @click="editItem(item)">
          <a>编辑</a>
        </span>
        <span slot="receiptEdit" slot-scope="item" @click="receiptEdit(item)">
          <a>关联</a>
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
          <a slot="name" slot-scope="text" @click="viewdetail(text)">{{
            text
          }}</a>
          <span slot="XMState" slot-scope="XMState">
            <a-tag v-if="XMState === '1'" color="volcano">
              <span>登记中</span>
            </a-tag>
            <a-tag v-if="XMState === '2'" color="geekblue">
              <span>派件中</span>
            </a-tag>
            <a-tag v-if="XMState === '3'" color="green">
              <span>测绘中</span>
            </a-tag>
            <a-tag v-if="XMState === '4'" color="LightSalmon">
              <span>一级检查</span>
            </a-tag>
            <a-tag v-if="XMState === '5'" color="Cyan">
              <span>二级检查</span>
            </a-tag>
            <a-tag v-if="XMState === '9'" color="SteelBlue">
              <span>审批中</span>
            </a-tag>
            <a-tag v-if="XMState === '6'" color="PaleVioletRed">
              <span>收费中</span>
            </a-tag>
            <a-tag v-if="XMState === '7'" color="Turquoise">
              <span>归档中</span>
            </a-tag>
            <a-tag v-if="XMState === '8'" color="SandyBrown">
              <span>已归档</span>
            </a-tag>
          </span>
          <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)"
            >查看</a
          >
        </a-table>
      </a-table>
    </div>
    <!-- </a-spin> -->
    <a-modal
      v-model="createContractVisible"
      title="新建合同"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateContract @createSuccessChild="parentFn" />
    </a-modal>
    <a-modal
      v-model="viewContractVisible"
      title="查看合同"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ContractViewTab
        @createSuccessChild="parentFn"
        @childFn="parentFn"
        :projectInfo="selectProjectInfo"
      />
    </a-modal>
    <a-modal
      v-model="modifyContractVisible"
      title="修改合同"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      @cancel="closeContractModify"
    >
      <ModifyContractModal
        :projectInfo="selectProjectInfo"
        @childFn="modifyParentFn"
      />
    </a-modal>
    <a-modal
      v-model="viewProjectInfoVisible"
      title="查看项目"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewProjectInfo v-bind:projectInfo="selectProjectInfo" />
    </a-modal>
    <a-modal
      v-model="viewReceiptVisible"
      title="发票查看"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewReceiptModal></ViewReceiptModal>
    </a-modal>
    <a-modal
      v-model="viewReceiptForContractVisible"
      title="关联发票"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewContractModalForContract
        :contractinfo="selectedContractInfo"
      ></ViewContractModalForContract>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../utils/global_variable";
import CreateContract from "./FlowWindowContract/CreateContract";
import ViewContract from "./FlowWindowContract/ViewContract";
import ModifyContract from "./FlowWindowContract/ModifyContract";
import ViewProjectInfo from "./common/ViewProjectInfo/ViewProjectInfo";
import ViewReceiptModal from "./FlowWinfowCalculateExpense/Receipt/ViewReceiptModal";
import ViewContractModalForContract from "./FlowWindowContract/Receipt/ViewReceiptModalForContract";
import ContractViewTab from "./FlowWindowContract/ContractViewTab";
import ModifyContractModal from "./FlowWindowContract/MofifyContractModal";
const ModuleID = 42;
const columns = [
  {
    title: "合同编号",
    dataIndex: "contractID",
    key: "ID",
    with: 80,
    // scopedSlots: { customRender: "contractname" },
  },
  { title: "合同名称", dataIndex: "contractName", key: "platform", width: 300 },
  { title: "合同签订时间", dataIndex: "contractSignTime", key: "version" },
  { title: "甲方（委托）单位", dataIndex: "contractClient", key: "upgradeNum" },
  {
    title: "收费方式",
    dataIndex: "isTotalPrice",
    key: "isTotalPrice",
    scopedSlots: { customRender: "isTotalPrice" },
  },
  {
    title: "查看",
    dataIndex: "Id",
    key: "contractID",
    scopedSlots: { customRender: "contractView" },
  },
  //receiptEdit
  {
    title: "编辑",
    dataIndex: "Id",
    key: "Id",
    scopedSlots: { customRender: "contractEdit" },
  },
  {
    title: "关联发票",
    dataIndex: "Id",
    key: "receiptEdit",
    scopedSlots: { customRender: "receiptEdit" },
  },
  {
    title: "删除",
    dataIndex: "Id",
    key: "contractDelete",
    scopedSlots: { customRender: "contractDelete" },
  },
  { title: "代建单位", dataIndex: "contractAssistCompany", key: "creator" },
];

const innerColumns = [
  {
    title: "项目登记号",
    dataIndex: "projectsn",
    key: "projectsn",
    width: 200,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "项目名称",
    dataIndex: "projectname",
    key: "projectname",
    width: 200,
  },
  {
    title: "项目状态",
    key: "XMState",
    dataIndex: "XMState",
    scopedSlots: { customRender: "XMState" },
    width: 200,
  },
  {
    title: "应收费用",
    dataIndex: "cost",
    key: "cost",
    width: 200,
  },
  {
    title: "已收费用",
    dataIndex: "getCost",
    key: "getCost",
    width: 200,
  },
  // {
  //   title: "查看",
  //   key: "viewdetail",
  //   dataIndex: "projectsn",
  //   scopedSlots: { customRender: "viewdetail" },
  //   width: 200,
  // },
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
    ViewProjectInfo,
    // ViewContract,
    //ModifyContract,
    ViewReceiptModal,
    ViewContractModalForContract,
    ContractViewTab,
    ModifyContractModal,
  },
  data() {
    return {
      ModuleID,
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
      spinning: false,
      viewProjectInfoVisible: false,
      selectProjectInfo: "",
      viewContractVisible: false,
      modifyContractVisible: false,
      viewReceiptVisible: false,
      viewReceiptForContractVisible: false,
      selectedContractInfo: "",
    };
  },
  methods: {
    async getContract() {
      this.spinning = true;
      const tmp_data = await request.get("/contractmanagement/getcontract");
      this.data = tmp_data.data;
      this.spinning = false;
    },
    async getAuthority() {
      const tmp_menu = await request("/common/getmoduleauthority", {
        params: {
          userid: JSON.parse(sessionStorage.getItem("userToken")).UserID,
          moduleid: this.ModuleID,
        },
      });
      const authority_temp = tmp_menu.data[0];
      this.authority_Add = authority_temp.RGP_ADD;
      this.authority_Browse = authority_temp.RGP_BROWSE;
      this.authority_Edit = authority_temp.RGP_EDIT;
      this.authority_Delete = authority_temp.RGP_DELETE;
      this.authority_Grant = authority_temp.RGP_GRANT;
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
      this.spinning = true;
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
      this.spinning = false;
    },
    viewItem(item) {
      console.log("select item", item);
      this.viewContractVisible = true;
      this.selectProjectInfo = item;
    },
    editItem(item) {
      console.log("modify item", item);
      this.modifyContractVisible = true;
      this.selectProjectInfo = item;
    },
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
                  that.$message.error("合同包含子项目或发票，无法删除");
                }
              });
          }
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
      // this.modifyContractVisible = false;
      this.getContract();
    },
    modifyParentFn() {
      this.modifyContractVisible = false;
      this.getContract();
    },
    viewdetail(item) {
      this.selectProjectInfo = item;
      this.viewProjectInfoVisible = true;
    },
    viewReceipt() {
      this.viewReceiptVisible = true;
    },
    receiptEdit(item) {
      this.viewReceiptForContractVisible = true;
      this.selectedContractInfo = item;
    },
    closeContractModify() {
      this.getContract();
    },
  },
  mounted: function() {
    this.getContract();
    this.getAuthority();
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
