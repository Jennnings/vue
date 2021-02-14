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
        title="合同管理"
      />
    </div>
    <div class="table_contianer" v-if="data">
      <a-table
        :columns="columns"
        :data-source="data"
        class="components-table-demo-nested"
      >
        <a slot="operation">Publish</a>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <span slot="status"> <a-badge status="success" />Finished </span>
          <span slot="operation" class="table-operation">
            <a>Pause</a>
            <a>Stop</a>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  Action 1
                </a-menu-item>
                <a-menu-item>
                  Action 2
                </a-menu-item>
              </a-menu>
              <a> More <a-icon type="down" /> </a>
            </a-dropdown>
          </span>
        </a-table>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  { title: "合同编号", dataIndex: "name", key: "name" },
  { title: "合同名称", dataIndex: "platform", key: "platform" },
  { title: "合同签订时间", dataIndex: "version", key: "version" },
  { title: "乙方（委托）单位", dataIndex: "upgradeNum", key: "upgradeNum" },
  { title: "代建单位", dataIndex: "creator", key: "creator" },
  { title: "查看", dataIndex: "createdAt", key: "createdAt" },
  { title: "编辑", dataIndex: "createdAt", key: "createdAt" },
  { title: "删除", dataIndex: "createdAt", key: "createdAt" },
];

const data = [];
for (let i = 0; i < 3; ++i) {
  data.push({
    key: i,
    name: "Screem",
    platform: "iOS",
    version: "10.3.4.5654",
    upgradeNum: 500,
    creator: "Jack",
    createdAt: "2014-12-24 23:12:00",
  });
}

const innerColumns = [
  { title: "日期", dataIndex: "date", key: "date" },
  { title: "历史文件", dataIndex: "name", key: "name" },
  { title: "文件性质", key: "state", scopedSlots: { customRender: "status" } },
//   { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
//   {
//     title: "Action",
//     dataIndex: "operation",
//     key: "operation",
//     scopedSlots: { customRender: "operation" },
//   },
];

const innerData = [];
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    date: "2014-12-24 23:12:00",
    name: "This is production name",
    upgradeNum: "Upgraded: 56",
  });
}

export default {
  data() {
    return {
      data,
      columns,
      innerColumns,
      innerData,
    };
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
}
</style>
