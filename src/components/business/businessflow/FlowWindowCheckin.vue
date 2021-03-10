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
        title="窗口登记"
      />
    </div>
    <div class="toolbar">
      <div class="itemLeft">
        <div class="itemName">
          <span>项目名称:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="项目名称"
            v-model="queryProjectName"
          />
        </div>
        <div class="itemName">
          <span>登记时间:</span>
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

      <div class="itemRight">
        <a-button
          type="primary"
          icon="file-add"
          style="width:110px"
          @click="newProject"
        >
          新增项目
        </a-button>
      </div>
    </div>
    <div class="table_contianer" v-if="data">
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
        <a-popconfirm
          title="确认提交"
          ok-text="确定"
          cancel-text="取消"
          slot="tonext"
          slot-scope="item"
          @confirm="confirmUpload(item)"
          @cancel="cancelUpload"
        >
          <a>提交派件</a>
        </a-popconfirm>
        <span slot="delete" slot-scope="item" @click="deleteClick(item)">
          <a>删除</a>
        </span>
      </a-table>
    </div>
    <a-modal
      v-model="createModalVisible"
      title="新建项目"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateProject @childFn="parentFn" />
    </a-modal>
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
  </div>
</template>
<script>
import request from "@/utils/request";
import CreateProject from "./FlowWindowCheckin/CreateProject";
import ModifyProject from "./FlowWindowCheckin/ModifyProject";
import axios from "axios";
import GLOBAL from "./../../../utils/global_variable";
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
    dataIndex: "Projectname",
    key: "Projectname",
    width: 250,
  },
  {
    title: "登记时间",
    dataIndex: "Clientdate",
    key: "Clientdate",
    width: 150,
  },
  {
    title: "委托单位",
    key: "Client",
    dataIndex: "Client",
    width: 250,
  },
  {
    title: "当前环节",
    key: "processCondition",
    dataIndex: "processCondition",
    scopedSlots: { customRender: "tags" },
    width: 150,
  },
  {
    title: "操作者",
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
    title: "提交派件",
    key: "toNext",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "tonext" },
    width: 120,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "Projectsn",
    scopedSlots: { customRender: "delete" },
    width: 100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    CreateProject,
    ModifyProject,
  },
  data() {
    return {
      data: null,
      columns,
      pagination_setting,
      createModalVisible: false,
      modifyModalVisible: false,
      distoryThis: true,
      params: null,
      sDate: "",
      eDate: "",
      queryProjectName: "",
      selectProjectInfo: "",
    };
  },
  methods: {
    async clickrequest() {
      const user = await request.get("/cxch/project");
      this.data = user.data;
    },
    onstartDateChange(date, dateString) {
      this.sDate = dateString;
    },
    onendDateChange(date, dateString) {
      this.eDate = dateString;
    },
    newProject() {
      this.createModalVisible = true;
    },
    parentFn() {
      this.createModalVisible = false;
      this.clickrequest();
    },
    async queryClicked() {
      console.log(
        "queryClicked",
        this.eDate,
        this.sDate,
        this.queryProjectName
      );
      const user = await request.get("/cxch/getQueryProject", {
        params: {
          eDate: this.eDate,
          sDate: this.sDate,
          projectName: this.queryProjectName,
        },
      });
      console.log("user", user);
      this.data = user.data;
    },
    clickforInfo(info) {
      //this.$message.success(info);
    },
    editorClick(item) {
      this.modifyModalVisible = true;
      this.selectProjectInfo = item;
    },
    toNextStep(item) {
      console.log(item);
    },
    deleteClick(item) {
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
            postParams = new URLSearchParams();
            postParams.append("Projectsn", item);
            axios
              .post(GLOBAL.env + "/cxch/deleteProject", postParams)
              .then((res) => {
                if (res.data === "修改成功") {
                  that.$message.success("删除成功");
                  that.clickrequest();
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
    cancelUpload() {
      console.log("取消");
    },
    confirmUpload(item) {
      let postParams;
      let that = this;
      postParams = new URLSearchParams();
      postParams.append("Projectsn", item);
      postParams.append(
        "djmanuserid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      axios.post(GLOBAL.env + "/cxch/toNextStep", postParams).then((res) => {
        if (res.data === "修改成功") {
          that.$message.success("提交成功");
          that.clickrequest();
        }
      });
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
  min-width: 1200px;
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
