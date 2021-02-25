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
      <!-- <div class="detail-item">
        <div class="basicInfo-title">
          工作内容
        </div>
        <a-textarea :rows="2" style="margin-top:5px" v-model="workingDetail" />
      </div> -->
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
          :data-source="chgclAddGroup"
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
              :default-value="record.number"
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
              v-if="chgclAddGroup.length"
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
        <a-textarea
          :rows="2"
          style="margin-top:5px"
          v-model="eventExplaination"
        />
      </div>
      <div class="detail-item otherInfoContainer">
        <div class="otherInfo">
          <div class="smallContainer">
            <div class="title">项目起止时间:</div>
            <div class=" positionModify">
              <a-date-picker
                @change="projectStartTimeChange"
                v-if="projectStartDate"
                :default-value="moment(projectStartDate, 'YYYY-MM-DD')"
              />~
              <a-date-picker
                @change="projectEndDateChange"
                v-if="projectEndDate"
                :default-value="moment(projectEndDate, 'YYYY-MM-DD')"
              />
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
              <a-input
                placeholder="委托单位现场负责人"
                v-model="sceneClientCharge"
              />
            </div>
            <div class="title title_two">确认时间:</div>
            <div class="inputContainer">
              <a-date-picker
                @change="clientConfirmDateChange"
                v-if="clientConfirmDate"
                :default-value="moment(clientConfirmDate, 'YYYY-MM-DD')"
              />
            </div>
          </div>
          <div class="smallContainer">
            <div class="title">测绘现场负责人:</div>
            <div class="inputContainer">
              <a-input
                placeholder="测绘现场负责人"
                v-model="sceneChargePerson"
              />
            </div>
            <div class="title title_two">确认时间:</div>
            <div class="inputContainer">
              <a-date-picker
                @change="sceneConfirmDateChange"
                v-if="sceneConfirmDate"
                :default-value="moment(sceneConfirmDate, 'YYYY-MM-DD')"
              />
            </div>
          </div>
        </div>
        <div class="otherInfo">
          <div class="smallContainer">
            <div class="title">提交资料:</div>
            <div class="inputContainer">
              <a-checkbox-group @change="onMaterialChange">
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
        <a-button
          type="default"
          style="margin-right:10px"
          @click="temporarySave"
        >
          暂存
        </a-button>
        <a-button type="primary" @click="upLoadMappingResult">
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
import moment from "moment";
const projectData = projectdata;
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
export default {
  props: ["projectInfo"],
  components: {
    MappingOpinionEditableTable,
  },
  data() {
    return {
      undertakingOpinion: "已完成测绘，通过自查，现提交质检。",
      fileList: [],
      uploading: false,
      userData: null,
      chgclAddGroup: [
        {
          key: 0,
          number: "2",
          type: "",
          unit: "平方米",
        },
      ],
      count: 1,
      projectType: projectData.data,
      projectStartDate: moment().format("YYYY-MM-DD"),
      projectEndDate: moment().format("YYYY-MM-DD"),
      clientConfirmDate: moment().format("YYYY-MM-DD"),
      sceneConfirmDate: moment().format("YYYY-MM-DD"),
      uploadMaterialType: [],
      sceneChargePerson: "",
      sceneClientCharge: "",
      mappingStaffGroup: "",
      workingDetail: "",
      eventExplaination: "",
      postParams: null,
      columns: [
        {
          title: "工作内容",
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
    moment,
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
      this.mappingStaffGroup = value;
    },
    //* 动态添加任务 *//
    onChange(date, dateString) {},
    selectprojectType(key, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        target.number = value;
        switch (value) {
          case "1":
            target.unit = "平方米";
            break;
          case "2":
            target.unit = "平方米";
            break;
          case "3":
            target.unit = "平方米";
            break;
          case "4":
            target.unit = "栋";
            break;
          case "5":
            target.unit = "栋";
            break;
          case "6":
            target.unit = "栋";
            break;
          case "7":
            target.unit = "个";
            break;
          case "8":
            target.unit = "栋";
            break;
          case "9":
            target.unit = "公里";
            break;
          case "10":
            target.unit = "平方米";
            break;
          case "11":
            target.unit = "公里";
            break;
          case "12":
            target.unit = "平方米";
            break;
          case "13":
            target.unit = "点";
            break;
          case "14":
            target.unit = "平方米";
            break;
          case "15":
            target.unit = "棵";
            break;
          case "16":
            target.unit = "户";
            break;
          case "17":
            target.unit = "平方米";
            break;
        }
        this.chgclAddGroup = chgclAddGroup;
      }
      // this.postParams.append(this.chgclAddGroup);
    },
    onCellChange(key, dataIndex, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      //this.postParams.append(key, dataIndex, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.chgclAddGroup = chgclAddGroup;
      }
    },
    onDelete(key) {
      // this.postParams.append(key);
      const chgclAddGroup = [...this.chgclAddGroup];
      this.chgclAddGroup = chgclAddGroup.filter((item) => item.key !== key);
    },
    handleAdd() {
      const { count, chgclAddGroup } = this;
      const newData = {
        key: this.count,
        type: "",
        number: "",
        unit: "",
      };
      this.chgclAddGroup = [...chgclAddGroup, newData];
      this.count = count + 1;
    },
    //* 动态添加任务结束 *//
    projectStartTimeChange(date, dateString) {
      this.projectStartDate = dateString;
    },
    projectEndDateChange(date, dateString) {
      this.projectEndDate = dateString;
    },
    clientConfirmDateChange(date, dateString) {
      this.clientConfirmDate = dateString;
    },
    sceneConfirmDateChange(date, dateString) {
      this.sceneConfirmDate = dateString;
    },
    onMaterialChange(checkedValues) {
      this.uploadMaterialType = checkedValues;
    },
    upLoadMappingResult() {
      console.log("uploadClicked");
      console.log("承办意见", this.undertakingOpinion);
      console.log("全部参与测绘人员", this.mappingStaffGroup);
      console.log("工作内容", this.workingDetail);
      console.log("工程量", this.chgclAddGroup);
      console.log("事项说明", this.eventExplaination);
      console.log("projectsdate", this.projectStartDate);
      console.log("项目结束时间", this.projectEndDate);
      console.log("委托单位现场负责人", this.sceneClientCharge);
      console.log("委托单位确认时间", this.clientConfirmDate);
      console.log("测绘现场负责人", this.sceneChargePerson);
      console.log("测绘现场确认时间", this.sceneConfirmDate);
      console.log("提交资料", this.uploadMaterialType);
    },
    temporarySave() {
      console.log("暂存");
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      //this.postParams.append("承办意见", this.undertakingOpinion);
      this.postParams.append("dongbz", this.mappingStaffGroup); //  需要格式化
      this.postParams.append("gznr", this.workingDetail);
      this.postParams.append("gcl", this.chgclAddGroup);
      this.postParams.append("smsx", this.eventExplaination);
      this.postParams.append("timebegin", this.projectStartDate);
      this.postParams.append("timeend", this.projectEndDate);
      this.postParams.append("wtdwxcfzr", this.sceneClientCharge);
      this.postParams.append("wtdwqrsj", this.clientConfirmDate);
      this.postParams.append("chxcfzr", this.sceneChargePerson);
      this.postParams.append("chqrjs", this.sceneConfirmDate);
      this.postParams.append("tjzllist", this.uploadMaterialType);
      axios
        .post(
          GLOBAL.env + "/mappingundertaking/remainMappingUndertaking",
          this.postParams
        )
        .then((res) => {
          console.log(res);
        });
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
