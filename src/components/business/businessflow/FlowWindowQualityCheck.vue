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
        title="质量检查"
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
      </div>
    </div>
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
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="
              tag === '1' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'
            "
          >
            <span v-if="tag === '1'">登记中</span>
            <span v-if="tag === '2'">派件中</span>
            <span v-if="tag !== '1' && tag !== '2'">检查中</span>
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
      v-model="qualityCheckOpinionVisible"
      title="质检意见"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <QualityCheck
        v-bind:projectInfo="selectProjectInfo"
        @closemodal="parentCloseModal"
      />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import ViewProjectInfo from "./common/ViewProjectInfo/ViewProjectInfo";
import QualityCheck from "./FlowWindowQualityCheck/QualityCheckOpinion";
const ModuleID = 34;
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
  {
    title: "办理",
    key: "tonextstep",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "tonextstep" },
    width: 100,
  },
  // {
  //   title: "坐落",
  //   key: "sceneLocation",
  //   dataIndex: "sceneLocation",
  //   width: 150,
  // },

  {
    title: "测绘承办",
    key: "clmanUser",
    dataIndex: "clmanUser",
    width: 120,
  },
  {
    title: "测绘提交",
    key: "cltjsj",
    dataIndex: "cltjsj",
    width: 100,
  },
  {
    title: "当前环节",
    key: "processCondition",
    dataIndex: "processCondition",
    scopedSlots: { customRender: "tags" },
    width: 120,
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
    ViewProjectInfo,
    QualityCheck,
  },
  data() {
    return {
      ModuleID,
      data: null,
      columns,
      pagination_setting,
      createModalVisible: false,
      viewProjectInfoVisible: false,
      distoryThis: true,
      params: null,
      sDate: "",
      eDate: "",
      queryProjectName: "",
      queryProjectClient: "",
      selectProjectInfo: "",
      queryProjectsn: "",
      spinning: false,
      qualityCheckOpinionVisible: false,
      authority_Add: false,
      authority_Browse: false,
      authority_Delete: false,
      authority_Edit: false,
      authority_Grant: false,
    };
  },
  methods: {
    async clickrequest() {
      this.spinning = true;
      const user = await request.get("/qualitycheck/project");
      this.data = user.data;
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
      console.log("queryClicked");
      this.spinning = true;
      const data = await request.get("qualitycheck/projectquery", {
        params: {
          projectsn: this.queryProjectsn,
          projectname: this.queryProjectName,
          projectClient: this.queryProjectClient,
          sDate: this.sDate,
          eDate: this.eDate,
        },
      });
      this.data = data.data;
      this.spinning = false;
    },
    viewdetail(item) {
      this.viewProjectInfoVisible = true;
      this.selectProjectInfo = item;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    tonextstep(item) {
      console.log("tonextstep");
      this.qualityCheckOpinionVisible = true;
      this.selectProjectInfo = item;
    },
    parentCloseModal() {
      this.qualityCheckOpinionVisible = false;
      this.clickrequest();
    },
  },
  created: function() {
    this.clickrequest();
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
