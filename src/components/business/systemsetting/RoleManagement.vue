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
        title="角色管理"
      />
    </div>
    <div class="toolbar">
      <div class="itemRight">
        <a-button
          type="primary"
          icon="file-add"
          style="width:110px"
          @click="createRole"
        >
          新增角色
        </a-button>
      </div>
    </div>
    <div class="table_contianer">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination_setting"
        :loading="spinning"
      >
        <a slot="name" slot-scope="text, index" @click="viewdetail(index)">{{
          text
        }}</a>
        <span slot="customTitle"><a-icon type="tags" /> 角色名称</span>
        <a slot="editor" slot-scope="item" @click="editorClick(item)">编辑</a>
        <a slot="authority" slot-scope="item" @click="authorityClick(item)"
          >授权</a
        >
        <a slot="delete" slot-scope="item" @click="deleteClick(item)">删除</a>
      </a-table>
    </div>
    <a-modal
      v-model="createRoleVisible"
      title="新增角色"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->
      <!--@closeModal="closeCreateModal"-->
      <CreateRole
        @createrolesuccess="createRoleSuccess"
        @cancelCreateRole="cancelCreateRole"
      />
    </a-modal>
    <a-modal
      v-model="viewRoleVisible"
      title="查看角色"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->
      <!--@closeModal="closeCreateModal"-->
      <ViewRole :selecteditem="selectedItem" />
    </a-modal>
    <a-modal
      v-model="editRoleVisible"
      title="编辑角色"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->
      <!--@closeModal="closeCreateModal"-->
      <ModifyRole
        :selecteditem="selectedItem"
        @cancelModifyRole="cancelModifyRole"
        @modifySuccess="modifySuccess"
      />
    </a-modal>
    <a-modal
      v-model="authorityRoleVisible"
      title="角色授权"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->
      <!--@closeModal="closeCreateModal"-->
      <AuthorityRole :selecteditem="selectedItem" />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../utils/global_variable";
import axios from "axios";
import CreateRole from "./rolemanagement/CreateRole";
import ViewRole from "./rolemanagement/ViewRole";
import ModifyRole from "./rolemanagement/ModifyRole";
import AuthorityRole from "./rolemanagement/AuthorityRole";
const columns = [
  {
    dataIndex: "rolename",
    key: "rolename",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150,
  },
  {
    title: "排序",
    dataIndex: "roleorder",
    key: "roleorder",
    width: 50,
  },
  {
    title: "说明",
    key: "roledescription",
    dataIndex: "roledescription",
    width: 100,
  },

  {
    title: "编辑",
    key: "editor",
    dataIndex: "roleid",
    scopedSlots: { customRender: "editor" },
    width: 100,
  },
  {
    title: "授权",
    key: "authority",
    dataIndex: "roleid",
    scopedSlots: { customRender: "authority" },
    width: 100,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "roleid",
    scopedSlots: { customRender: "delete" },
    width: 100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    CreateRole,
    ViewRole,
    ModifyRole,
    AuthorityRole,
  },
  data() {
    return {
      createRoleVisible: false,
      distoryThis: true,
      columns,
      pagination_setting,
      spinning: false,
      data: [],
      selectedItem: "",
      viewRoleVisible: false,
      editRoleVisible: false,
      authorityRoleVisible: false,
    };
  },
  methods: {
    async getRoles() {
      this.spinning = true;
      const tmp_data = await request.get("rolemanagement/getrole");
      this.data = tmp_data.data;
      this.spinning = false;
    },
    createRole() {
      this.createRoleVisible = true;
    },
    editorClick(item) {
      this.editRoleVisible = true;
      this.selectedItem = item;
    },
    viewdetail(item) {
      this.viewRoleVisible = true;
      this.selectedItem = item.roleid;
    },
    authorityClick(item) {
      this.authorityRoleVisible = true;
      this.selectedItem = item;
    },
    deleteClick(item) {
      let postParams = new URLSearchParams();
      let that = this;
      this.$confirm({
        title: "确定删除该角色?",
        content: "删除角色将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          if (item) {
            postParams.append("roleid", item);
            axios
              .post(GLOBAL.env + "/rolemanagement/deleterole", postParams)
              .then((res) => {
                if (res.data == "success") {
                  that.$message.success("删除成功");
                  that.getRoles();
                } else {
                  that.$message.error("删除失败");
                }
              });
          }
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    createRoleSuccess() {
      this.createRoleVisible = false;
      this.getRoles();
    },
    modifySuccess() {
      this.editRoleVisible = false;
      this.getRoles();
    },
    cancelCreateRole() {
      this.createRoleVisible = false;
    },
    cancelModifyRole() {
      this.editRoleVisible = false;
    },
  },
  mounted: function() {
    this.getRoles();
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
