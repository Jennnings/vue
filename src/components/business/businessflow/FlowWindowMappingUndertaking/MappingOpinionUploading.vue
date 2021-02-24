<template>
  <div class="opinionContainer">
    <div class="basicInfo">
      <div class="basicInfo-title">
        承办意见
      </div>
      <a-textarea
        v-model="undertakingOpinion"
        :rows="2"
        style="margin-top:5px"
      />
      <div class="buttonGroup">
        <div calss="uploadingFile">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
        </div>
        <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style=" width:120px;margin-top:10px"
          @click="handleUpload"
        >
          {{ uploading ? "上传中" : "开始上传" }}
        </a-button>
      </div>
    </div>

    <div class="detailInfo">
      <div class="splitLine"></div>
      <div class="detail-item">
        <span>
          全部参与测绘人员:
        </span>
        <a-select mode="tags" style="width: 80%" @change="staffPicker">
          <a-select-option v-for="user in userData" :key="user.UserID">
            {{ user.UserName }}
          </a-select-option>
        </a-select>
      </div>
      <div class="detail-item">
        <div class="basicInfo-title">
          工作内容
        </div>
        <a-textarea :rows="2" style="margin-top:5px" />
      </div>
      <div class="detail-item">
        <div class="basicInfo-title">
          <span>工程量</span>
          <a-button
            class="editable-add-btn"
            @click="handleAdd"
            size="small"
            style="margin-left:10px"
          >
            添 加
          </a-button>
        </div>
        <a-table
          bordered
          :data-source="dataSource"
          :columns="columns"
          size="small"
          style="margin-top:10px"
          :pagination="false"
        >
          <template slot="projectType" slot-scope="text, record">
            <a-select
              style="width: 200px"
              placeholder="选择项目类型"
              @change="selectprojectType(record.key, $event)"
              v-if="projectType"
            >
              <a-select-option v-for="item in projectType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="projectNumber" slot-scope="text, record">
            <MappingOpinionEditableTable
              :text="text"
              @change="onCellChange(record.key, 'projectNumber', $event)"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="dataSource.length"
              title="是否确认删除?"
              @confirm="() => onDelete(record.key)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <div class="detail-item">
        <div class="basicInfo-title">
          事项说明
        </div>
        <a-textarea :rows="2" style="margin-top:5px" />
      </div>
      <div class="detail-item otherInfoContainer">
        <div class="otherInfo">
          <div class="smallContainer">
            <div class="title">项目起止时间:</div>
            <div class=" positionModify">
              <a-date-picker @change="onChange" />~
              <a-date-picker @change="onChange" />
            </div>
          </div>
          <div class="smallContainer">
            <!-- <div class="title">项目拆分(个数):</div>
            <div class="inputContainer">
              <a-input placeholder="项目拆分个数" /> -->
            <!-- </div> -->
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
      <div class="detail-item buttonContainer">
        <a-button type="default" style="margin-right:10px">
          暂存
        </a-button>
        <a-button type="primary">
          提交
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import MappingOpinionEditableTable from "./MappingOpinionEditableTable";
import projectdata from "../../../../assets/menulist/project-type.json";
const projectData = projectdata;
export default {
  props: ["projectInfo"],
  components: {
    MappingOpinionEditableTable,
  },
  data() {
    return {
      undertakingOpinion: "已完成测绘，通过自查，现提交质检",
      fileList: [],
      uploading: false,
      userData: null,
      dataSource: [],
      count: 0,
      projectType: projectData.data,
      columns: [
        {
          title: "工程类别",
          dataIndex: "projectType",
          width: "20%",
          scopedSlots: { customRender: "projectType" },
        },
        {
          title: "工程量",
          dataIndex: "number",
          scopedSlots: { customRender: "projectNumber" },
        },
        {
          title: "单位",
          dataIndex: "unit",
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  methods: {
    //***********************文件上传开始 ******************************//
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files[]", file);
      });
      this.uploading = true;
    },
    //***********************文件上传结束 ******************************//
    async getchUsers() {
      const user = await request.get("/mappingundertaking/getchUsers");
      this.userData = user.data;
    },
    staffPicker(value) {
      console.log(`selected ${value}`);
    },
    //* 动态添加任务 *//
    onChange(date, dateString) {},
    selectprojectType(key, value) {
      const dataSource = [...this.dataSource];
      console.log(key, value, dataSource);
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target.number = value;
        if (value == 1) {
          target.unit = "平方米";
        } else {
          target.unit = "棵";
        }
        this.dataSource = dataSource;
      }
      console.log(this.dataSource);
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      console.log(key, dataIndex, value, dataSource);
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      console.log(key);
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: this.count,
        type: "",
        number: "",
        unit: "",
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
  },
  created: function() {
    this.getchUsers();
    console.log(this.projectInfo);
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

  .basicInfo {
    width: 100%;
    display: flex;
    font-size: 15px;
    flex-direction: column;
    .buttonGroup {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
    }
  }
  .detailInfo {
    .splitLine {
      width: 100%;
      height: 1px;
      background-color: #d4d4d4;
      margin-top: 10px;
    }
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 15px;
    .detail-item {
      margin-top: 10px;
    }
  }
  .buttonContainer {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
        .positionModify {
          margin-left: 56px;
        }
      }
    }
  }
  .opinionContainer::-webkit-scrollbar-track {
  }

  .opinionContainer::-webkit-scrollbar {
    width: 5px;
  }

  .opinionContainer::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    margin-left: 10px;
    border-radius: 3px;
  }
}
</style>
