<template>
  <div>
    <a-card
      style="width:100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    >
      <div v-if="noTitleKey === 'undertaking'">
        <div class="opinionContainer">
          <div class="titleContainer">
            <span>承办意见：</span>
          </div>
          <div class="contentContainer">
            <a-textarea v-model="undertakingOpinion" :rows="2" />
          </div>
          <div class="fileUpload">
            ..this placed the file up load button...
          </div>
          <div class="staffSelection" v-if="userData">
            <span>参与测绘的全部人员：</span>
            <a-select mode="tags" style="width: 80%" @change="staffPicker">
              <a-select-option v-for="user in userData" :key="user.UserID">
                {{ user.UserName }}
              </a-select-option>
            </a-select>
          </div>
          <div class="titleContainer">
            <span>工作内容</span>
          </div>
          <div class="contentContainer">
            <a-textarea placeholder="工作内容" :rows="2" />
          </div>
          <div class="titleContainer" style="margin-top:10px">
            <span>工程量</span>
            <a-button
              class="editable-add-btn"
              @click="handleAdd"
              size="small"
              style="margin-left:10px"
            >
              添加项目
            </a-button>
            <a-table
              bordered
              :data-source="dataSource"
              :columns="columns"
              size="small"
              style="margin-top:10px"
              :pagination="false"
            >
              <template slot="name" slot-scope="text, record">
                <MappingOpinionEditableTable
                  :text="text"
                  @change="onCellChange(record.key, 'name', $event)"
                />
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="Sure to delete?"
                  @confirm="() => onDelete(record.key)"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
          <div class="contentContainer"></div>
          <div class="titleContainer">
            <span>事项说明</span>
          </div>
          <div class="contentContainer">
            <a-textarea placeholder="事项说明" :rows="2" />
          </div>
          <div class="otherInfoContainer">
            <div class="otherInfo">
              <div class="smallContainer">
                <div class="title">项目起止时间:</div>
                <div class="inputContainer">
                  <a-date-picker @change="onChange" />~
                  <a-date-picker @change="onChange" />
                </div>
              </div>
              <div class="smallContainer">
                <div class="title">项目拆分(个数):</div>
                <div class="inputContainer">
                  <a-input placeholder="项目拆分个数" />
                </div>
              </div>
            </div>
            <div class="otherInfo">
              <div class="smallContainer">
                <div class="title">委托单位现场负责人:</div>
                <div class="inputContainer">
                  <a-input placeholder="委托单位现场负责人" />
                </div>
                <div class="title title_two">确认时间:</div>
                <div class="inputContainer">
                  <a-date-picker @change="onChange" />
                </div>
              </div>
              <div class="smallContainer">
                <div class="title">测绘现场负责人:</div>
                <div class="inputContainer">
                  <a-input placeholder="测绘现场负责人" />
                </div>
                <div class="title title_two">确认时间:</div>
                <div class="inputContainer">
                  <a-date-picker @change="onChange" />
                </div>
              </div>
            </div>
            <div class="otherInfo">
              <div class="smallContainer">
                <div class="title">提交资料:</div>
                <div class="inputContainer">
                  <a-checkbox-group @change="onChange">
                    <a-row>
                      <a-checkbox value="A">
                        外业草图
                      </a-checkbox>
                      <a-checkbox value="B">
                        成果资料
                      </a-checkbox>
                      <a-checkbox value="C">
                        其他
                      </a-checkbox>
                    </a-row>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div>
          <div class="buttonContainer">
            <a-button type="default" style="margin-right:10px">
              暂存
            </a-button>
            <a-button type="primary">
              提交
            </a-button>
          </div>
        </div>
      </div>
      <div v-else-if="noTitleKey === 'backtoformer'">
        <div class="backFormerContainer">
          <div class="titleContainer">
            <span>退回意见：</span>
          </div>
          <div class="contentContainer">
            <a-textarea placeholder="退回意见" :rows="4" />
          </div>
          <div class="buttonContainer">
            <a-button type="danger">
              退回
            </a-button>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
import MappingOpinionEditableTable from "./MappingOpinionEditableTable";
export default {
  props: ["projectInfo"],
  components: {
    MappingOpinionEditableTable,
  },
  data() {
    return {
      tabListNoTitle: [
        {
          key: "undertaking",
          tab: "承办意见",
        },
        {
          key: "backtoformer",
          tab: "退回意见",
        },
      ],
      noTitleKey: "undertaking",
      userData: null,
      undertakingOpinion: "已完成测绘，通过自查，现提交质检。",
      undertakingOpinionParams: {},
      dataSource: [
        {
          key: "0",
          name: "Edward King 0",
          age: "32",
          address: "London, Park Lane no. 0",
        },
        {
          key: "1",
          name: "Edward King 1",
          age: "32",
          address: "London, Park Lane no. 1",
        },
      ],
      count: 2,
      columns: [
        {
          title: "工程类别",
          dataIndex: "name",
          width: "30%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "单位",
          dataIndex: "age",
        },
        {
          title: "单价",
          dataIndex: "address",
        },
        {
          title: "总价",
          dataIndex: "address",
        },
        {
          title: "类型",
          dataIndex: "address",
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  methods: {
    async getchUsers() {
      const user = await request.get("/mappingundertaking/getchUsers");
      this.userData = user.data;
      console.log(this.userData);
    },
    onTabChange(key, type) {
      this[type] = key;
    },
    staffPicker(value) {
      console.log(`selected `);
    },
    onChange(date, dateString) {},
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
  },
  created: function() {
    this.getchUsers();
  },
};
</script>
<style lang="scss">
.opinionContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow: auto;
  padding: 0px 24px 0px 0px;
  .titleContainer {
    font-size: 16px;
  }
  .contentContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .staffSelection {
    font-size: 16px;
  }
  .otherInfoContainer {
    height: 130px;
    width: 100%;
    display: grid;
    margin-top: 15px;
    grid-template-rows: 40px 40px 40px;
    row-gap: 5px;
    .otherInfo {
      display: grid;
      grid-template-columns: 50% 50%;
      .smallContainer {
        display: flex;
        align-items: baseline;
        .title {
          width: fit-content;
        }
        .title_two {
          margin-left: 20px;
        }
        .inputContainer {
          margin-left: 10px;
        }
      }
    }
  }
  .buttonContainer {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
.opinionContainer::-webkit-scrollbar-track {
  //background-color: green;
}

.opinionContainer::-webkit-scrollbar {
  width: 5px;
}

.opinionContainer::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  margin-left: 10px;
  border-radius: 3px;
}
.backFormerContainer {
  width: 100%;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .titleContainer {
    font-size: 16px;
  }
  .contentContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .buttonContainer {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
.ant-card-body {
  padding: 24px 0px 24px 24px;
}
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
