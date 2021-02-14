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
      >
        <a slot="name" slot-scope="text" @click="clickforInfo(text)">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> 项目登记号</span>
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
  </div>
</template>
<script>
import request from "@/utils/request";
import CreateProject from "./FlowWindowCheckin/CreateProject";
import axios from "axios";
const columns = [
  {
    dataIndex: "Projectname",
    key: "Projectname",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    width:350,
  },
  {
    title: "项目名称",
    dataIndex: "Client",
    key: "Client",
    width:350,
  },
  {
    title: "登记时间",
    dataIndex: "Contact",
    key: "Contact",
    width:250,
  },
  {
    title: "委托单位",
    key: "Contacttel",
    dataIndex: "Contacttel",
    width:150,
  },
  {
    title: "当前环节",
    key: "processCondition",
    dataIndex: "processCondition",
    scopedSlots: { customRender: "tags" },
    width:100,
  },
  {
    title: "操作者",
    key: "processer",
    dataIndex: "processer",
    width:150,
  },
  {
    title: "编辑",
    key: "editor",
    dataIndex: "editor",
    width:100,
  },
  {
    title: "删除",
    key: "delete",
    dataIndex: "delete",
    width:100,
  },
];
const pagination_setting = {
  defaultPageSize: 10,
};
export default {
  components: {
    CreateProject,
  },
  data() {
    return {
      data: null,
      columns,
      pagination_setting,
      createModalVisible: false,
      distoryThis: false,
      params: null,
    };
  },
  methods: {
    async clickrequest() {
      const user = await request.get("/cxch/project");
      this.data = user.data;
    },
    onstartDateChange(date, dateString) {
      console.log(date, dateString);
    },
    onendDateChange(date, dateString) {
      console.log(date, dateString);
    },
    newProject() {
      this.createModalVisible = true;
    },
    parentFn() {
      this.createModalVisible = false;
    },
    queryClicked() {
      console.log("queryClicked");
      this.params = new URLSearchParams();
      this.params.append("username", "username66666");
      this.params.append("password", "passwprd");
      this.params.append("id", "idididdi");
      axios
        .post("http://192.168.0.101:66/cxch/insertUser", this.params)
        .then((res) => {
          console.log(res);
        });
    },
    clickforInfo(info) {
      this.$message.success(info)
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
    user-select: none;
  }
}
</style>
