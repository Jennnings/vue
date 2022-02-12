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
        title="核算收费"
      />
    </div>
    <div class="toolbar">
      <div class="itemLeft">
        <div class="itemName">
          <span>项目登记号:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="项目登记号"
            v-model="queryProjectsn"
          />
        </div>
        <div class="itemName">
          <span>项目名称:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="项目名称"
            v-model="queryProjectName"
          />
        </div>
        <div class="itemName">
          <span>委托单位:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="委托单位"
            v-model="queryProjectClient"
          />
        </div>
        <div class="itemName">
          <span>委托时间:</span>
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
        <!-- <div class="itemName">
          <a-button
            type="primary"
            icon="account-book"
            style="width:110px"
            @click="viewReceipt"
          >
            发票查看
          </a-button>
        </div> -->
      </div>
    </div>
    <!-- <a-spin :spinning="spinning"> -->
    <div class="table_contianer">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination_setting"
        :loading="spinning"
        rowKey="id"
      >
        <a slot="name" slot-scope="text" @click="viewdetail(text)">{{
          text
        }}</a>
        <span slot="customTitle"><a-icon type="tags" /> 项目登记号</span>
        <span slot="tags" slot-scope="tags">
          <a-tag color="green" v-if="tags === true">
            已开单
          </a-tag>
          <a-tag color="red" v-if="tags === false">
            未开单
          </a-tag>
        </span>
        <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)"
          >查看</a
        >
        <a slot="tonextstep" slot-scope="item" @click="tonextstep(item)"
          >办理</a
        >
        <span slot="delete" slot-scope="item" @click="deleteClick(item)">
          <a>删除</a>
        </span>
      </a-table>
    </div>
    <!-- </a-spin> -->
    <a-modal
      :dialog-style="{ top: '20px' }"
      v-model="expenseOpinionVisible"
      title="核算收费"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ExpenseOpinion
        v-bind:projectInfo="selectProjectInfo"
        :isFromComprehensiveInquery="false"
        @closemodal="parentCloseModal"
      />
      <!-- 
         -->
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
    <!-- <a-modal
      v-model="viewReceiptVisible"
      title="发票查看"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ViewReceiptModal></ViewReceiptModal>
    </a-modal> -->
  </div>
</template>
<script>
import request from "@/utils/request";
import ExpenseOpinion from "./FlowWinfowCalculateExpense/ExpenseOpinion";
import ViewProjectInfo from "./common/ViewProjectInfo/ViewProjectInfo";
const ModuleID = 36;
const columns = [
  {
    dataIndex: "Projectsn",
    key: "Projectsn",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 100,
  },
  {
    title: "项目名称",
    dataIndex: "projectName",
    key: "projectName",
    width: 260,
  },
  {
    title: "委托单位",
    dataIndex: "projectClient",
    key: "projectClient",
    width: 250,
  },
  // {
  //   title: "坐落",
  //   key: "sceneLocation",
  //   dataIndex: "sceneLocation",
  //   width: 150,
  // },
  {
    title: "开单情况",
    key: "ischeck",
    dataIndex: "ischeck",
    scopedSlots: { customRender: "tags" },
    width: 100,
  },
  {
    title: "办理",
    key: "tonextstep",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "tonextstep" },
    width: 100,
  },
  {
    title: "测绘承办",
    key: "clmanUser",
    dataIndex: "clmanUser",
    width: 100,
  },
  {
    title: "一级检查",
    key: "jcmanUser",
    dataIndex: "jcmanUser",
    width: 100,
  },
  {
    title: "二级检查",
    key: "shmanUser",
    dataIndex: "shmanUser",
    width: 100,
  },
  //TODO 查看模态框取消编辑状态
  // {
  //   title: "查看",
  //   key: "viewdetail",
  //   dataIndex: "Projectsn",
  //   scopedSlots: { customRender: "viewdetail" },
  //   width: 100,
  // },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    ExpenseOpinion,
    ViewProjectInfo,
  },
  data() {
    return {
      ModuleID,
      data: null,
      columns,
      pagination_setting,
      queryProjectsn: "",
      queryProjectName: "",
      queryProjectClient: "",
      sDate: "",
      eDate: "",
      expenseOpinionVisible: false,
      selectProjectInfo: "",
      distoryThis: true,
      spinning: false,
      viewProjectInfoVisible: false,
      viewReceiptVisible: false,
      authority_Add: false,
      authority_Browse: false,
      authority_Delete: false,
      authority_Edit: false,
      authority_Grant: false,
    };
  },
  methods: {
    async getInitData() {
      this.spinning = true;
      const tmp_data = await request.get("/calculateexpense/initProject/");
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
    async queryClicked() {
      this.spinning = true;
      const tmp_data = await request.get("/calculateexpense/queryProject/", {
        params: {
          projectsn: this.queryProjectsn,
          projectname: this.queryProjectName,
          projectClient: this.queryProjectClient,
          sDate: this.sDate,
          eDate: this.eDate,
        },
      });
      this.data = tmp_data.data;
      this.spinning = false;
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    tonextstep(item) {
      this.expenseOpinionVisible = true;
      this.selectProjectInfo = item;
    },
    parentCloseModal() {
      this.expenseOpinionVisible = false;
      this.getInitData();
    },
    viewdetail(item) {
      this.selectProjectInfo = item;
      this.viewProjectInfoVisible = true;
    },
    viewReceipt() {
      this.viewReceiptVisible = true;
    },
  },
  mounted: function() {
    this.getInitData();
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
  }
}
</style>
