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
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../utils/global_variable";
import axios from "axios";
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
  data() {
    return {
      columns,
      pagination_setting,
      spinning: false,
      data: [],
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
      console.log("createRole");
    },
    editorClick() {},
    authorityClick() {},
    deleteClick() {},
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
