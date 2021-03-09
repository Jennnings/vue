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
        title="项目派件"
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
        rowKey="id"
      >
        <a slot="name" slot-scope="text" @click="clickforInfo(text)">{{
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
            <span v-if="tag !== '1' && tag !== '2'">结算中</span>
          </a-tag>
        </span>
        <a slot="editor" slot-scope="item" @click="editorClick(item)">编辑</a>
        <span
          slot="projectsendout"
          slot-scope="item"
          @click="projectSendOut(item)"
        >
          <a>办理</a>
        </span>
        <span slot="sceneLocation" slot-scope="text">
          <span v-if="text === 'undefined'"></span>
          <span v-else>{{ text }}</span>
        </span>
      </a-table>
    </div>
    <a-modal
      v-model="modifyModalVisible"
      title="修改项目"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ModifyProject v-bind:projectInfo="selectProjectInfo" />
    </a-modal>
    <a-modal
      v-model="projectSendoutVisible"
      title="派件意见"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <ProjectSendOut
        v-bind:projectInfo="selectProjectInfo"
        @childFn="parentFn"
      />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import ModifyProject from "./FlowWindowSendOut/ModifyProject";
import ProjectSendOut from "./FlowWindowSendOut/ProjectSendOut";
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
    scopedSlots: { customRender: "sceneLocation" },
    width: 150,
  },
  {
    title: "希望进场时间",
    key: "hopeToEnterTime",
    dataIndex: "hopeToEnterTime",
    width: 100,
  },
  {
    title: "当前环节",
    key: "processCondition",
    dataIndex: "processCondition",
    scopedSlots: { customRender: "tags" },
    width: 150,
  },
  {
    title: "窗口登记",
    key: "djmanUser",
    dataIndex: "djmanUser",
    width: 150,
  },
  {
    title: "编辑",
    key: "editor",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "editor" },
    width: 100,
  },
  {
    title: "办理",
    key: "projectsendout",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "projectsendout" },
    width: 100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    ModifyProject,
    ProjectSendOut,
  },
  data() {
    return {
      queryProjectName: "",
      queryProjectsn: "",
      data: null,
      columns,
      pagination_setting,
      modifyModalVisible: false,
      projectSendoutVisible: false,
      selectProjectInfo: "",
      distoryThis: true,
      eDate: "",
      sDate: "",
      queryProjectClient: "",
    };
  },
  methods: {
    //初始化查询 undefined问题
    async clickrequest() {
      const that = this;
      const tmpdata = await request.get("/sendout/project");
      this.data = tmpdata.data;
    },
    //点击按钮查询
    async queryClicked() {
      const user = await request.get("/sendout/projectQuery", {
        params: {
          eDate: this.eDate,
          sDate: this.sDate,
          projectName: this.queryProjectName,
          projectSn: this.queryProjectsn,
          projectClient: this.queryProjectClient,
        },
      });
      console.log("user", user);
      this.data = user.data;
    },
    editorClick(item) {
      this.modifyModalVisible = true;
      this.selectProjectInfo = item;
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    projectSendOut(item) {
      this.projectSendoutVisible = true;
      this.selectProjectInfo = item;
    },
    parentFn() {
      this.projectSendoutVisible = false;
      this.clickrequest();
    },
  },
  created: function() {
    this.clickrequest();
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
    user-select: none;
  }
}
</style>
