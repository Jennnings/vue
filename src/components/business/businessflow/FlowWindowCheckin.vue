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
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> 项目名称</span>
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
  },
  {
    title: "客户",
    dataIndex: "Client",
    key: "Client",
  },
  {
    title: "合同",
    dataIndex: "Contact",
    key: "Contact",
  },
  {
    title: "联系电话",
    key: "Contacttel",
    dataIndex: "Contacttel",
    scopedSlots: { customRender: "tags" },
  },
  {
    title: "地址",
    key: "Projectaddress",
    dataIndex: "Projectaddress",
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
      params:null,
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
        .post("http://192.168.18.38:66/cxch/insertUser",this.params)
        .then((res) => {
          console.log(res);
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
  }
}
</style>
