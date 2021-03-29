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
    </div>

    <div class="detailInfo">
      <div class="splitLine"></div>
      <div class="detail-item">
        <span>
          全部参与测绘人员:
        </span>
        <a-select
          mode="tags"
          style="width: 80%"
          @change="staffPicker"
          :default-value="mappingStaffGroup"
        >
          <a-select-option v-for="user in userData" :key="user.UserName">
            {{ user.UserName }}
          </a-select-option>
        </a-select>
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
          :data-source="chgclAddGroup"
          :columns="columns"
          size="small"
          style="margin-top:10px"
          :pagination="false"
          rowKey="id"
        >
          <template slot="projectType" slot-scope="text, record">
            <a-select
              style="width: 200px"
              placeholder="选择项目类型"
              @change="selectprojectType(record.key, $event)"
              v-if="projectType"
              :default-value="record.type"
            >
              <a-select-option v-for="item in projectType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="projectNumber" slot-scope="text, record">
            <MappingOpinionEditableTable
              :text="text"
              @change="onCellChange(record.key, 'number', $event)"
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
                :allowClear="false"
              />~
              <a-date-picker
                @change="projectEndDateChange"
                v-if="projectEndDate"
                :default-value="moment(projectEndDate, 'YYYY-MM-DD')"
                :allowClear="false"
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
                :allowClear="false"
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
                :allowClear="false"
              />
            </div>
          </div>
        </div>
        <div class="otherInfo">
          <div class="smallContainer">
            <div class="title">提交资料:</div>
            <div class="inputContainer">
              <a-checkbox-group
                @change="onMaterialChange"
                :value="uploadMaterialType"
              >
                <a-row>
                  <a-checkbox value="1">
                    外业草图
                  </a-checkbox>
                  <a-checkbox value="2">
                    成果资料
                  </a-checkbox>
                  <a-checkbox value="3">
                    其他
                  </a-checkbox>
                </a-row>
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-item">
        <a-list
          size="small"
          bordered
          :data-source="uploadedFileList"
          style="width:100%"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a @click="downloadFile(item)">{{ item }}</a>

            <div slot="actions">
              <a-popconfirm
                title="是否确认删除？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteSelectItem(item)"
              >
                <a>删除</a>
              </a-popconfirm>
            </div>
          </a-list-item>
        </a-list>
        <div class="buttonGroup" style="margin-top:10px">
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
      chgclAddGroup: [],
      count: 1,
      projectType: projectData.data,
      projectStartDate: "",
      projectEndDate: "",
      clientConfirmDate: "",
      sceneConfirmDate: "",
      uploadMaterialType: [],
      sceneChargePerson: "",
      sceneClientCharge: "",
      mappingStaffGroup: [],
      workingDetail: "",
      eventExplaination: "",
      postParams: null,
      uploadedFileList: [],
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
        formData.append("myfile", file);
      });
      formData.append("projectsn", this.projectInfo);
      let existedFileStr = "";
      if (this.uploadedFileList.length != 0) {
        for (let i = 0; i < this.uploadedFileList.length; i++) {
          existedFileStr += this.uploadedFileList[i] + "\/";
        }
        existedFileStr = existedFileStr.slice(0, existedFileStr.length - 1);
      }
      formData.append("existedFiles", existedFileStr);
      this.uploading = true;
      axios
        .post(GLOBAL.env + "/mappingundertaking/uploadchcg", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            this.getUndertakingInfo();
            this.fileList = [];
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    //***********************文件上传结束 ******************************//
    async getchUsers() {
      const user = await request.get("/mappingundertaking/getchUsers");
      this.userData = user.data;
    },
    async getUndertakingInfo() {
      const data = await request.get(
        "/mappingundertaking/mappingUndertakingInit",
        { params: { projectsn: this.projectInfo } }
      );
      this.eventExplaination = data.data[0].smsx;
      this.sceneClientCharge = data.data[0].wtdwxcfzr;
      this.sceneChargePerson = data.data[0].chxcfzr;
      if (data.data[0].tjzllist != null) {
        this.uploadMaterialType = data.data[0].tjzllist.split(",");
      } else {
        this.uploadMaterialType = [];
      }
      this.mappingStaffGroup = [];
      if (data.data[0].dongbz != null) {
        for (let j = 0; j < data.data[0].dongbz.split(";").length - 1; j++) {
          this.mappingStaffGroup.push(
            data.data[0].dongbz.split(";")[j].split(",")[0]
          );
        }
      } else {
        this.mappingStaffGroup = [];
      }
      this.chgclAddGroup = [];
      if (data.data[0].gznr != null) {
        this.count = data.data[0].gznr.split(",").length;
        for (let j = 0; j < this.count; j++) {
          let newData = {
            key: j + 1,
            type: data.data[0].gznr.split(",")[j],
            number: data.data[0].gcl.split(";")[j].replace(/[^0-9]/gi, ""),
            unit: data.data[0].gcl.split(";")[j].replace(/[0-9]/g, ""),
          };
          this.chgclAddGroup.push(newData);
        }
      } else {
        this.count = 0;
        this.chgclAddGroup = [];
      }
      this.projectStartDate = data.data[0].timebegin;
      this.projectEndDate = data.data[0].timeend;
      this.clientConfirmDate = data.data[0].wtdwqrsj;
      this.sceneConfirmDate = data.data[0].chqrsj;
      if (data.data[0].chcgfile != null) {
        this.uploadedFileList = data.data[0].chcgfile.split("/");
      }
      if (this.projectStartDate === "") {
        this.projectStartDate = moment().format("YYYY-MM-DD");
      }
      if (this.projectEndDate === "") {
        this.projectEndDate = moment().format("YYYY-MM-DD");
      }
      if (this.clientConfirmDate === "") {
        this.clientConfirmDate = moment().format("YYYY-MM-DD");
      }
      if (this.sceneConfirmDate === "") {
        this.sceneConfirmDate = moment().format("YYYY-MM-DD");
      }
    },
    staffPicker(value) {
      this.mappingStaffGroup = value;
    },
    //* 动态添加任务 *//
    selectprojectType(key, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        switch (value) {
          case "1":
            target.type = "面积预测";
            target.unit = "平方米";
            break;
          case "2":
            target.type = "面积实测";
            target.unit = "平方米";
            break;
          case "3":
            target.type = "人防预测";
            target.unit = "平方米";
            break;
          case "4":
            target.type = "人防实测";
            target.unit = "栋";
            break;
          case "5":
            target.type = "施工放样";
            target.unit = "栋";
            break;
          case "6":
            target.type = "竣工测量";
            target.unit = "栋";
            break;
          case "7":
            target.type = "控制测量";
            target.unit = "个";
            break;
          case "8":
            target.type = "日照测量";
            target.unit = "栋";
            break;
          case "9":
            target.type = "管线测量";
            target.unit = "公里";
            break;
          case "10":
            target.type = "土方测量";
            target.unit = "平方米";
            break;
          case "11":
            target.type = "断面测量";
            target.unit = "公里";
            break;
          case "12":
            target.type = "地形测量";
            target.unit = "平方米";
            break;
          case "13":
            target.type = "变形测量";
            target.unit = "点";
            break;
          case "14":
            target.type = "宗地调查";
            target.unit = "平方米";
            break;
          case "15":
            target.type = "其他测量";
            target.unit = "棵";
            break;
          case "16":
            target.type = "分户调查";
            target.unit = "户";
            break;
          case "17":
            target.type = "土地分割";
            target.unit = "平方米";
            break;
        }
        this.chgclAddGroup = chgclAddGroup;
      }
      // this.postParams.append(this.chgclAddGroup);
    },
    onCellChange(key, dataIndex, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.chgclAddGroup = chgclAddGroup;
      }
    },
    onDelete(key) {
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
      console.log("提交");
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      let staff_str = "";
      for (let j = 0; j < this.mappingStaffGroup.length; j++) {
        staff_str += this.mappingStaffGroup[j] + ",0" + ";";
      }
      this.postParams.append("dongbz", staff_str); //  测绘参与全部人员
      let project_type_str = "";
      let project_num_str = "";
      for (let j = 0; j < this.chgclAddGroup.length; j++) {
        project_type_str += this.chgclAddGroup[j].type + ",";
        project_num_str +=
          this.chgclAddGroup[j].number + this.chgclAddGroup[j].unit + ";";
      }
      project_type_str = project_type_str.substring(
        0,
        project_type_str.length - 1
      );
      this.postParams.append("gznr", project_type_str); //工作内容
      this.postParams.append("gcl", project_num_str); //工程量
      this.postParams.append("smsx", this.eventExplaination); //说明事项
      this.postParams.append("timebegin", this.projectStartDate); //开始时间
      this.postParams.append("timeend", this.projectEndDate); //结束时间
      this.postParams.append("wtdwxcfzr", this.sceneClientCharge); //委托单位负责人
      this.postParams.append("wtdwqrsj", this.clientConfirmDate); //委托单位确认时间
      this.postParams.append("chxcfzr", this.sceneChargePerson); //测绘现场负责人
      this.postParams.append("chqrsj", this.sceneConfirmDate); //测绘确认时间
      this.postParams.append("tjzllist", this.uploadMaterialType); //提交资料清单
      axios
        .post(
          GLOBAL.env + "/mappingundertaking/postMappingUndertaking",
          this.postParams
        )
        .then((res) => {
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",测绘->质检,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.undertakingOpinion;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  if (this.fileList.length == 0) {
                    let updatefile = new URLSearchParams();
                    updatefile.append("projectsn", this.projectInfo);
                    let existedFileStr = "";
                    if (this.uploadedFileList.length != 0) {
                      for (let i = 0; i < this.uploadedFileList.length; i++) {
                        existedFileStr += this.uploadedFileList[i] + "\/";
                      }
                      existedFileStr = existedFileStr.slice(
                        0,
                        existedFileStr.length - 1
                      );
                    }
                    updatefile.append("existedFiles", existedFileStr);
                    this.uploading = true;
                    axios
                      .post(
                        GLOBAL.env +
                          "/mappingundertaking/updatechcgwithoutnewfile",
                        updatefile
                      )
                      .then((res) => {
                        if (res.data === "success") {
                          this.$message.success("提交成功");
                          //this.getUndertakingInfo();
                          this.fileList = [];
                          this.$emit("uploadSuccess");
                        } else {
                          this.$message.error("提交失败");
                        }
                        this.uploading = false;
                      });
                  } else {
                    this.handleUpload();
                    this.$emit("uploadSuccess");
                  }
                  //this.$emit("uploadSuccess");
                }
              });
          } else {
            this.$message.error("提交失败");
          }
        });
    },
    temporarySave() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      let staff_str = "";
      for (let j = 0; j < this.mappingStaffGroup.length; j++) {
        staff_str += this.mappingStaffGroup[j] + ",0" + ";";
      }
      this.postParams.append("dongbz", staff_str); //  测绘参与全部人员
      let project_type_str = "";
      let project_num_str = "";
      for (let j = 0; j < this.chgclAddGroup.length; j++) {
        project_type_str += this.chgclAddGroup[j].type + ",";
        project_num_str +=
          this.chgclAddGroup[j].number + this.chgclAddGroup[j].unit + ";";
      }
      project_type_str = project_type_str.substring(
        0,
        project_type_str.length - 1
      );
      this.postParams.append("gznr", project_type_str); //工作内容
      this.postParams.append("gcl", project_num_str); //工程量
      this.postParams.append("smsx", this.eventExplaination); //说明事项
      this.postParams.append("timebegin", this.projectStartDate); //开始时间
      this.postParams.append("timeend", this.projectEndDate); //结束时间
      this.postParams.append("wtdwxcfzr", this.sceneClientCharge); //委托单位负责人
      this.postParams.append("wtdwqrsj", this.clientConfirmDate); //委托单位确认时间
      this.postParams.append("chxcfzr", this.sceneChargePerson); //测绘现场负责人
      this.postParams.append("chqrsj", this.sceneConfirmDate); //测绘确认时间
      this.postParams.append("tjzllist", this.uploadMaterialType); //提交资料清单
      axios
        .post(
          GLOBAL.env + "/mappingundertaking/remainMappingUndertaking",
          this.postParams
        )
        .then((res) => {
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",测绘->暂存,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.undertakingOpinion;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  if (this.fileList.length == 0) {
                    let updatefile = new URLSearchParams();
                    updatefile.append("projectsn", this.projectInfo);
                    let existedFileStr = "";
                    if (this.uploadedFileList.length != 0) {
                      for (let i = 0; i < this.uploadedFileList.length; i++) {
                        existedFileStr += this.uploadedFileList[i] + "\/";
                      }
                      existedFileStr = existedFileStr.slice(
                        0,
                        existedFileStr.length - 1
                      );
                    }
                    updatefile.append("existedFiles", existedFileStr);
                    this.uploading = true;
                    axios
                      .post(
                        GLOBAL.env +
                          "/mappingundertaking/updatechcgwithoutnewfile",
                        updatefile
                      )
                      .then((res) => {
                        if (res.data === "success") {
                          this.$message.success("暂存成功");
                          this.getUndertakingInfo();
                          this.fileList = [];
                        } else {
                          this.$message.error("暂存失败");
                        }
                        this.uploading = false;
                      });
                  } else {
                    this.handleUpload();
                  }
                }
              });
          } else {
            this.$message.error("暂存失败");
          }
        });
    },
    async downloadFile(item) {
      const tmp_data = await request.get("/common/downloadfile", {
        params: {
          postfilename: item,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/downloadfile",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          postfilename: item,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
    deleteSelectItem(item) {
      const index = this.uploadedFileList.indexOf(item);
      const newFileList = this.uploadedFileList.slice();
      newFileList.splice(index, 1);
      this.uploadedFileList = newFileList;
    },
  },
  created: function() {
    this.getchUsers();
  },
  mounted: function() {
    this.getUndertakingInfo();
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
