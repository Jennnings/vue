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
        title="调度管理"
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
          <span>项目坐落:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="项目坐落"
            v-model="queryProjectLocation"
          />
        </div>
        <div class="itemName">
          <span>委托时间:</span>
          <a-date-picker @change="onstartDateChange" style="margin-left:10px" />
          <span style="margin-left:10px">~</span>
          <a-date-picker @change="onendDateChange" style="margin-left:10px" />
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="itemLeft">
        <div class="itemName">
          <span>委托人:</span>
          <a-auto-complete
            style="width: 200px;margin-left:40px"
            placeholder="委托人"
            v-model="queryProjectClientPeople"
          />
        </div>
        <div class="itemName">
          <span>项目状态:</span>
          <a-select
            style="width: 200px;margin-left:10px;height:32px"
            @change="projectStateSelection"
            size="default"
            :allowClear="true"
            v-if="projectState"
          >
            <a-select-option v-for="data in projectState" :key="data.index">
              {{ data.value }}
            </a-select-option>
          </a-select>
        </div>
        <div class="itemName">
          <span>项目类型:</span>
          <a-select
            style="width: 200px;margin-left:10px;height:32px"
            @change="projectTypeSelection"
            size="default"
            :allowClear="true"
            v-if="projectType"
          >
            <a-select-option v-for="data in projectType" :key="data.index">
              {{ data.value }}
            </a-select-option>
          </a-select>
        </div>
        <div class="itemName">
          <span>测绘承办:</span>
          <a-select
            style="width: 200px;margin-left:10px;height:32px"
            @change="selectChUserChange"
            size="default"
            :allowClear="true"
            v-if="userData"
          >
            <a-select-option v-for="user in userData" :key="user.UserID">
              {{ user.UserName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="itemName">
          <span>归档序号:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="归档序号"
            v-model="queryPeojectRecordNum"
          />
        </div>
        <div class="itemName">
          <span>合同编号:</span>
          <a-auto-complete
            style="width: 150px;margin-left:10px"
            placeholder="合同编号"
            v-model="queryContractID"
          />
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="itemLeft"></div>
      <div class="itemRight">
        <div class="itemName" style="margin-right:30px">
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
      >
        <span slot="customTitle"> 项目登记号</span>
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
            <span>质检中</span>
          </a-tag>
          <a-tag v-if="XMState === '5'" color="Cyan">
            <span>审核中</span>
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
        <span slot="isReceipted" slot-scope="isReceipted">
          <a-icon
            v-if="isReceipted"
            type="check-circle"
            theme="twoTone"
            two-tone-color="#52c41a"
          />
          <a-icon
            v-if="!isReceipted"
            type="close-circle"
            theme="twoTone"
            two-tone-color="red"
          />
        </span>
        <a
          slot="editdetail"
          slot-scope="item"
          @click="editdetail(item)"
          :disabled="!authority_Edit"
          >编辑合同</a
        >
        <a slot="tonextstep" slot-scope="item" @click="tonextstep(item)"
          >办理</a
        >
        <a slot="dispatch" slot-scope="item" @click="dispatchProject(item)"
          >调度</a
        >
        <a
          slot="tocopystep"
          slot-scope="item"
          @click="copyProject(item)"
          :disabled="!authority_Add"
          >复制</a
        >
        <span slot="contractRepeat" slot-scope="isRepeated">
          <a-tag v-if="isRepeated == ''" color="red">
            <span>未登记</span>
          </a-tag>
          <a-tag v-if="isRepeated != ''" color="#52c41a">
            <span>{{ isRepeated }}</span>
          </a-tag>
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
      v-model="viewDispatchProjectVisible"
      title="项目调度"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      @cancel="afterCloseModal"
    >
      <DispatchProject
        :selecteditem="selectProjectInfo"
        @canceldispatch="cancelDispatch"
      />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../utils/global_variable";
import projectdata from "./../../../assets/menulist/project-type.json";
import project_state from "./../../../assets/menulist/project-state.json";
import ViewProjectInfo from "./../businessflow/common/ViewProjectInfo/ViewProjectInfo";
import DispatchProject from "./dispatchmanagement/DispatchProject";
const projectData = projectdata;
const projectStateData = project_state;
const columns = [
  {
    title: "归档号",
    key: "projcetRecordNum",
    dataIndex: "projcetRecordNum",
    width: 85,
  },
  {
    dataIndex: "Projectsn",
    key: "Projectsn",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 120,
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
    width: 230,
  },
  {
    title: "登记时间",
    key: "Djtjsj",
    dataIndex: "Djtjsj",
    scopedSlots: { customRender: "Djtjsj" },
    width: 150,
  },
  {
    title: "项目状态",
    key: "XMState",
    dataIndex: "XMState",
    scopedSlots: { customRender: "XMState" },
    width: 150,
  },
  {
    title: "调度",
    key: "dispatch",
    dataIndex: "Projectid",
    scopedSlots: { customRender: "dispatch" },
    width: 80,
  },
];
const pagination_setting = {
  defaultPageSize: 8,
};
export default {
  components: {
    ViewProjectInfo,
    DispatchProject,
  },
  data() {
    return {
      pagination_setting,
      columns,
      projectType: projectData.data,
      projectState: projectStateData.data,
      queryProjectsn: "",
      queryProjectName: "",
      queryProjectClient: "",
      sDate: "",
      eDate: "",
      queryProjectLocation: "",
      queryProjectClientPeople: "",
      queryProjectState: "",
      queryProjectType: "",
      queryProjectClManUserID: "",
      queryPeojectRecordNum: "",
      queryContractID: "",
      userData: [],
      spinning: false,
      data: [],
      viewProjectInfoVisible: false,
      selectProjectInfo: "",
      viewDispatchProjectVisible: false,
      distoryThis: true,
    };
  },
  methods: {
    async getInitProject() {
      this.spinning = true;
      const tmp_data = await request.get("comprehensiveinquery/initquery");
      this.data = tmp_data.data;
      this.spinning = false;
    },
    async getchUsers() {
      const user = await request.get("/sendout/getchUsers");
      this.userData = user.data;
    },
    async queryClicked() {
      this.spinning = true;
      const tmp_data = await request.get("comprehensiveinquery/querypeoject", {
        params: {
          projectsn: this.queryProjectsn,
          projectname: this.queryProjectName,
          projectClient: this.queryProjectClient,
          sDate: this.sDate,
          eDate: this.eDate,
          xmstate: this.queryProjectState,
          location: this.queryProjectLocation,
          clientpeople: this.queryProjectClientPeople,
          projecttype: this.queryProjectType,
          clmanuserid: this.queryProjectClManUserID,
          recordnum: this.queryPeojectRecordNum,
          hetongid: this.queryContractID,
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
    selectChUserChange(value) {
      this.queryProjectClManUserID = value;
      if (value == undefined) {
        this.queryProjectClManUserID = "";
      }
    },
    projectTypeSelection(value) {
      this.queryProjectType = value;
      if (value == undefined) {
        this.queryProjectType = "";
      }
      console.log(this.queryProjectType);
    },
    projectStateSelection(value) {
      this.queryProjectState = value;
      if (value == undefined) {
        this.queryProjectState = "";
      }
    },
    dispatchProject(item) {
      this.viewDispatchProjectVisible = true;
      this.selectProjectInfo = item;
    },
    viewdetail(item) {
      this.viewProjectInfoVisible = true;
      this.selectProjectInfo = item;
    },
    cancelDispatch() {
      this.viewDispatchProjectVisible = false;
      this.getInitProject();
    },
    afterCloseModal() {
      this.getInitProject();
    },
  },
  mounted: function() {
    this.getInitProject();
    this.getchUsers();
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
