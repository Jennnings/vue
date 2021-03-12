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
        title="项目归档"
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
        <span slot="customTitle"><a-icon type="tags" /> 项目登记号</span>
        <a slot="viewdetail" slot-scope="item" @click="viewdetail(item)"
          >查看</a
        >
        <a slot="tonextstep" slot-scope="item" @click="tonextstep(item)"
          >办理</a
        >
      </a-table>
    </div>
    <a-modal
      v-model="recordProjectVisible"
      title="项目归档"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      rowKey="id"
    >
      <RecordProject
        v-bind:projectInfo="selectProjectInfo"
        @updateSuccess="parentCloseModal"
      />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import RecordProject from "./FlowWindowRecordProject/RecordProjectOpinion";
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
    title: "坐落",
    key: "sceneLocation",
    dataIndex: "sceneLocation",
    width: 150,
  },
  {
    title: "归档号",
    key: "recordNum",
    dataIndex: "recordNum",
    width: 100,
  },

  {
    title: "收费核算",
    key: "sfmanUser",
    dataIndex: "sfmanUser",
    width: 100,
  },
  {
    title: "收费时间",
    key: "sftjsj",
    dataIndex: "sftjsj",
    width: 100,
  },
  //TODO 查看模态框取消编辑状态
  {
    title: "查看",
    key: "viewdetail",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "viewdetail" },
    width: 100,
  },
  {
    title: "办理",
    key: "tonextstep",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "tonextstep" },
    width: 100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    RecordProject,
  },
  data() {
    return {
      columns,
      pagination_setting,
      data: null,
      queryProjectsn: "",
      queryProjectName: "",
      queryProjectClient: "",
      sDate: "",
      eDate: "",
      recordProjectVisible: false,
      selectProjectInfo: "",
      distoryThis: true,
      spinning: false,
    };
  },
  methods: {
    async getProject() {
      this.spinning = true;
      const tmp_data = await request.get("recordproject/getproject");

      this.data = tmp_data.data;
      this.spinning = false;
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    async queryClicked() {
      this.spinning = true;
      const tmp_data = await request.get("recordproject/queryproject", {
        params: {
          projectsn: this.queryProjectsn,
          projectname: this.queryProjectName,
          clientname: this.queryProjectClient,
          sDate: this.sDate,
          eDate: this.eDate,
        },
      });
      this.data = tmp_data.data;
      this.spinning = false;
    },
    viewdetail(item) {},
    tonextstep(item) {
      this.selectProjectInfo = item;
      this.recordProjectVisible = true;
    },
    parentCloseModal() {
      this.recordProjectVisible = false;
      this.getProject();
    },
  },
  mounted: function() {
    this.getProject();
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
