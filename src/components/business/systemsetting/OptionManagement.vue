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
        title="操作列表"
      />
    </div>
    <div class="toolbar">
      <div class="itemRight">
        <a-button
          type="primary"
          icon="file-add"
          style="width:110px"
          @click="createOption"
        >
          新增操作
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
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="tags" /> 名称</span>
        <a slot="editor" slot-scope="item" @click="editorClick(item)">编辑</a>
        <a slot="delete" slot-scope="item" @click="deleteClick(item)">删除</a>
      </a-table>
    </div>
    <a-modal
      v-model="createOptionVisible"
      title="新增操作"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->

      <CreateOption
        @createsuccess="createSuccess"
        @createcancel="createCancel"
      />
    </a-modal>
    <a-modal
      v-model="modifyOptionVisible"
      title="编辑操作"
      :footer="null"
      width="800px"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <!-- @cancel="cancelEdit" -->

      <ModifyOption :selecteditem="selecteditem" @cancelmodify="cancelModify" />
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../utils/global_variable";
import axios from "axios";
import CreateOption from "./optionmanagement/CreateOption";
import ModifyOption from "./optionmanagement/ModifyOption";
const columns = [
  {
    dataIndex: "AuthorityName",
    key: "AuthorityName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width: 150,
  },
  {
    title: "标识",
    dataIndex: "AuthorityTag",
    key: "AuthorityTag",
    width: 50,
  },
  {
    title: "排序",
    key: "AuthorityOrder",
    dataIndex: "AuthorityOrder",
    width: 100,
  },

  {
    title: "说明",
    key: "AuthorityDescription",
    dataIndex: "AuthorityDescription",
    width: 100,
  },
  {
    title: "编辑",
    key: "editor",
    dataIndex: "AuthorityID",
    scopedSlots: { customRender: "editor" },
    width: 100,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "AuthorityID",
    scopedSlots: { customRender: "delete" },
    width: 100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    CreateOption,
    ModifyOption,
  },
  data() {
    return {
      columns,
      pagination_setting,
      data: [],
      spinning: false,
      createOptionVisible: false,
      distoryThis: true,
      modifyOptionVisible: false,
      selecteditem: "",
    };
  },
  methods: {
    async getOptionList() {
      this.spinning = true;
      const tmp_data = await request.get("optionmanagement/getoptionlist");
      this.data = tmp_data.data;
      this.spinning = false;
    },
    createOption() {
      this.createOptionVisible = true;
    },
    editorClick(item) {
      console.log(item);
      this.modifyOptionVisible = true;
      this.selecteditem = item;
    },
    deleteClick(item) {
      let postParams = new URLSearchParams();
      let that = this;
      this.$confirm({
        title: "确定删除该权限?",
        content: "删除权限将无法恢复",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          if (item) {
            postParams.append("authorityid", item);
            axios
              .post(GLOBAL.env + "/optionmanagement/deleteoption", postParams)
              .then((res) => {
                if (res.data == "success") {
                  that.$message.success("删除成功");
                  that.getOptionList();
                } else {
                  that.$message.error("删除失败");
                }
              });
          }
        },
      });
    },
    createSuccess() {
      this.createOptionVisible = false;
      this.getOptionList();
    },
    createCancel() {
      this.createOptionVisible = false;
    },
    cancelModify() {
      this.modifyOptionVisible = false;
    },
  },
  mounted: function() {
    this.getOptionList();
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
