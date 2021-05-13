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
        title="用户管理"
      />
    </div>
    <div class="toolbar">
      <div class="itemLeft">
        <div class="itemName">
          <span>用户名:</span>
          <a-auto-complete
            style="width: 200px;margin-left:10px"
            placeholder="用户名"
            v-model="queryUserName"
          />
        </div>
        <div class="itemName">
          <a-button
            type="primary"
            icon="search"
            style="width:110px"
            @click="queryClicked"
          >
            用户查找
          </a-button>
        </div>
      </div>
      <div class="itemRight">
        <a-button
          type="primary"
          icon="file-add"
          style="width:110px"
          @click="createUser"
        >
          新增用户
        </a-button>
      </div>
    </div>
    <div class="table_contianer">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination_setting"
        :loading="spinning"
        rowKey="userId"
      >
        <a slot="name" slot-scope="text, index" @click="viewdetail(index)">{{
          text
        }}</a>
        <span slot="customTitle"><a-icon type="tags" /> 用户名</span>
        <a slot="editor" slot-scope="item" @click="editorClick(item)">编辑</a>
        <a slot="delete" slot-scope="item" @click="deleteClick(item)">删除</a>
      </a-table>
    </div>
    <a-modal
      v-model="createUserVisible"
      title="创建新用户"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <CreateUser @closeModal="closeCreateModal" />
    </a-modal>
    <a-modal
      v-model="viewUserVisible"
      title="查看用户信息"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!--@closeModal="closeCreateModal"-->
      <ViewUser :selecteduser="selectedid" />
    </a-modal>
    <a-modal
      v-model="editUserVisible"
      title="编辑用户信息"
      :footer="null"
      width="1300px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
      @cancel="cancelEdit"
    >
      <!--@closeModal="closeCreateModal"-->
      <EditUser :selecteduser="selectedid" @closeEditModal="closeEditModal" />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../utils/global_variable";
import CreateUser from "./usermanagement/CreateUser";
import ViewUser from "./usermanagement/ViewUser";
import EditUser from "./usermanagement/EditUser";
import axios from "axios";
const columns = [
  // {
  //   dataIndex: "Projectsn",
  //   key: "Projectsn",
  //   slots: { title: "customTitle" },
  //   scopedSlots: { customRender: "name" },
  //   width: 150,
  // },
  {
    dataIndex: "userName",
    key: "userName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150,
  },
  {
    title: "用户角色",
    dataIndex: "userrole",
    key: "userrole",
    width: 250,
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    scopedSlots: { customRender: "tonextstep" },
    width: 100,
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
    width: 120,
  },
  {
    title: "最后一次登录时间",
    key: "lastLoginTime",
    dataIndex: "lastLoginTime",
    width: 100,
  },
  {
    title: "编辑",
    key: "editor",
    dataIndex: "userId",
    scopedSlots: { customRender: "editor" },
    width: 100,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "userId",
    scopedSlots: { customRender: "delete" },
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
    CreateUser,
    ViewUser,
    EditUser,
  },
  data() {
    return {
      data: [],
      columns,
      pagination_setting,
      spinning: false,
      queryUserName: "",
      createUserVisible: false,
      distoryThis: true,
      viewUserVisible: false,
      selectedid: "",
      editUserVisible: false,
    };
  },
  methods: {
    async getUserList() {
      this.spinning = true;
      const tmp_data = await request.get("usermanagement/getusers");
      this.data = tmp_data.data;
      this.spinning = false;
    },
    async queryClicked() {
      this.spinning = true;
      const user = await request.get("/usermanagement/queryusers", {
        params: {
          queryname: this.queryUserName,
        },
      });
      this.data = user.data;
      this.spinning = false;
    },
    createUser() {
      this.createUserVisible = true;
    },
    viewdetail(item) {
      this.selectedid = item.userId;
      this.viewUserVisible = true;
    },
    editorClick(item) {
      this.selectedid = item;
      this.editUserVisible = true;
    },
    deleteClick(item) {
      let postParams;
      let that = this;
      this.$confirm({
        title: "确定删除该用户?",
        content: "删除用户将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          //执行删除操作
          if (item) {
            postParams = new URLSearchParams();
            postParams.append("userid", item);
            axios
              .post(GLOBAL.env + "/usermanagement/deleteuser", postParams)
              .then((res) => {
                if (res.data === "success") {
                  that.$message.success("删除成功");
                  that.getUserList();
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
    closeCreateModal() {
      this.createUserVisible = false;
      this.getUserList();
    },
    closeEditModal() {
      this.editUserVisible = false;
      this.getUserList();
    },
    cancelEdit() {
      console.log("editmodalClose");
      this.getUserList();
    },
  },
  created: function() {
    this.getUserList();
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
