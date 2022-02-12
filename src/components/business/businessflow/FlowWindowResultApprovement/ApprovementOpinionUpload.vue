<template>
  <div class="opinionContainer">
    <div class="item">
      <div class="itemTitle">
        <span>小组填报工作量</span>
        <a-button
          class="editable-add-btn"
          @click="handleGCLAdd"
          size="small"
          style="margin-left:10px"
        >
          添 加
        </a-button>
      </div>
      <div class="itemContainer">
        <a-table
          bordered
          :data-source="chgclAddGroup"
          :columns="gclcolumns"
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
              v-model="record.type"
            >
              <a-select-option v-for="item in projectType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="(e) => e.preventDefault()"
                  @click="addCustomerProjecttItem"
                >
                  <a-icon type="plus" />
                  自定义项目
                </div>
              </div>
            </a-select>
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
          <template slot="projectUnit" slot-scope="text, record">
            <a-select
              style="width: 200px"
              placeholder="选择项目单位"
              @change="selectUnitType(record.key, $event)"
              v-if="unitType"
              v-model="record.unit"
            >
              <a-select-option v-for="item in unitType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="(e) => e.preventDefault()"
                  @click="addCustomerUnitItem"
                >
                  <a-icon type="plus" />
                  自定义项目
                </div>
              </div>
            </a-select>
          </template>
          <template slot="projectNumber" slot-scope="text, record">
            <ApprovementOpinionEditableTable
              :text="text"
              @change="onGCLChange(record.key, 'number', $event)"
            />
          </template>
        </a-table>
      </div>
      <div class="itemOption">
        <a-button
          type="primary"
          style="float:right;margin-right:10px;margin-top:10px"
          @click="updateGCL"
        >
          工作量更新
        </a-button>
      </div>
    </div>
    <div class="item">
      <div class="itemTitle">
        详细意见
      </div>
      <div class="itemContainer">
        <a-textarea
          v-model="qualitycheckOpinion"
          :rows="2"
          style="margin-top:5px"
        />
      </div>
    </div>
    <div class="item">
      <div class="itemTitle">
        <span>
          参与测绘人员工作量
        </span>
        <a-button
          class="editable-add-btn"
          @click="handleStaffAdd"
          size="small"
          style="margin-left:10px"
        >
          添 加
        </a-button>
      </div>
      <div class="itemContainer">
        <a-table
          bordered
          :data-source="mappingStaffGroup"
          :columns="staffgclcolums"
          size="small"
          style="margin-top:10px"
          :pagination="false"
        >
          <template slot="userSelect" slot-scope="text, record">
            <a-select
              style="width: 200px"
              placeholder="选择人员"
              @change="selectStaff(record.key, $event)"
              v-if="userData"
              v-model="record.UserName"
            >
              <a-select-option v-for="item in userData" :key="item.UserName">
                {{ item.UserName }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="userOperation" slot-scope="text, record">
            <a-popconfirm
              v-if="mappingStaffGroup.length"
              title="是否确认删除?"
              @confirm="() => onDeleteStaffGZL(record.key)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
          <template slot="gzl" slot-scope="text, record">
            <ApprovementOpinionEditableTable
              :text="text"
              @change="onStaffChange(record.key, 'gzl', $event)"
            />
          </template>
        </a-table>
      </div>
      <div class="itemOption">
        <a-button
          type="primary"
          style="float:right;margin-right:10px;margin-top:10px"
          @click="updateStaff"
        >
          人员更新
        </a-button>
      </div>
    </div>
    <div class="itemupload">
      <div class="splitLine"></div>
      <a-button
        type="primary"
        style="float:right;margin-right:10px;margin-top:10px"
        @click="uploadProject"
      >
        提交
      </a-button>
    </div>
    <a-modal
      v-model="addProjectModalVisible"
      title="添加自定义工作内容"
      @ok="handleOk"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <a-input v-model="projectTypeCustomer"> </a-input>
    </a-modal>
    <a-modal
      v-model="addUnitModalVisible"
      title="添加自定义单位信息"
      @ok="handleUnitOk"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <a-input v-model="unitTypeCustomer"> </a-input>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import projectdata from "../../../../assets/menulist/project-worktype.json";
import unitdata from "../../../../assets/menulist/project-unit.json";
import ApprovementOpinionEditableTable from "./ApprovementOpinionEditableTable";
import moment from "moment";
import axios from "axios";
const projectData = projectdata;
const unitData = unitdata;
export default {
  props: ["projectInfo"],
  components: {
    ApprovementOpinionEditableTable,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      qualitycheckOpinion: "同意，请按照收费标准进行收费。",
      gclcolumns: [
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
          scopedSlots: { customRender: "projectUnit" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      staffgclcolums: [
        {
          title: "人员姓名",
          dataIndex: "UserName",
          width: "20%",
          scopedSlots: { customRender: "userSelect" },
        },
        {
          title: "工作量",
          dataIndex: "gzl",
          width: "50%",
          scopedSlots: { customRender: "gzl" },
        },
        {
          title: "操作",
          dataIndex: "userOperation",
          width: "30%",
          scopedSlots: { customRender: "userOperation" },
        },
      ],
      chgclAddGroup: [],
      count: 0,
      mappingStaffGroup: [],
      mappingStaffGroupCount: 0,
      projectType: projectData.data,
      unitType: unitData.data,
      userData: null,
      postParams: null,
      addProjectModalVisible: false,
      distoryThis: true,
      projectTypeCustomer: "",
      addUnitModalVisible: false,
      unitTypeCustomer: "",
    };
  },
  methods: {
    moment,
    //初始化表单模态框
    async getProjectInfo() {
      const data = await request.get(
        "/mappingundertaking/mappingUndertakingInit",
        { params: { projectsn: this.projectInfo } }
      );
      this.eventExplaination = data.data[0].smsx;
      this.sceneClientCharge = data.data[0].wtdwxcfzr;
      this.sceneChargePerson = data.data[0].chxcfzr;
      this.clientConfirmDate = data.data[0].wtdwqrsj;
      this.sceneConfirmDate = data.data[0].chqrsj;
      if (data.data[0].tjzllist != null) {
        this.uploadMaterialType = data.data[0].tjzllist.split(",");
      } else {
        this.uploadMaterialType = [];
      }
      //this.mappingStaffGroup = data.data[0].dongbz.split(",");
      console.log(data.data[0].gznr);
      console.log(data.data[0].gcl);
      //参与测绘人员工作量
      if (data.data[0].dongbz != null) {
        for (let j = 0; j < data.data[0].dongbz.split(";").length - 1; j++) {
          let newData = {
            key: j,
            UserName: data.data[0].dongbz.split(";")[j].split(",")[0],
            gzl: data.data[0].dongbz.split(";")[j].split(",")[1],
          };
          this.mappingStaffGroup.push(newData);
        }
      } else {
        this.mappingStaffGroup = [];
      }
      this.mappingStaffGroupCount = this.mappingStaffGroup.length;
      //小组填报工程量
      if (data.data[0].gznr != null) {
        this.count = data.data[0].gznr.split(",").length;
        for (let j = 0; j < this.count; j++) {
          let newData = {
            key: j,
            type: data.data[0].gznr.split(",")[j],
            number: data.data[0].gcl.split(";")[j].replace(/[^0-9.]/gi, ""),
            unit: data.data[0].gcl.split(";")[j].replace(/[0-9.]+/g, ""),
            // number: parseFloat(data.data[0].gcl.split(";")[j]),
            // unit: data.data[0].gcl.split(";")[j].replace(/[0-9]/g, ""),
          };
          console.log(newData);
          this.chgclAddGroup.push(newData);
        }
      } else {
        this.count = 0;
        this.chgclAddGroup = [];
      }
      console.log("mapping staff group", this.mappingStaffGroup);
    },
    //获取用户列表
    async getchUsers() {
      const user = await request.get("/mappingundertaking/getchUsers");
      this.userData = user.data;
    },
    //工程量添加
    handleGCLAdd() {
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
    //工程量文字输入变化
    onGCLChange(key, dataIndex, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      //this.postParams.append(key, dataIndex, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.chgclAddGroup = chgclAddGroup;
      }
    },
    //人员工作量输入框变化
    onStaffChange(key, dataIndex, value) {
      const mappingStaffGroup = [...this.mappingStaffGroup];
      const target = mappingStaffGroup.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.mappingStaffGroup = mappingStaffGroup;
      }
    },
    //工作人员添加
    handleStaffAdd() {
      const { mappingStaffGroupCount, mappingStaffGroup } = this;
      const newData = {
        key: this.mappingStaffGroupCount,
        userName: "",
        gzl: "",
      };
      this.mappingStaffGroup = [...mappingStaffGroup, newData];
      this.mappingStaffGroupCount = mappingStaffGroupCount + 1;
    },
    //选择项目/工作类型
    selectprojectType(key, value) {
      const chgclAddGroup = [...this.chgclAddGroup];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        const selectedvalue = this.projectType.find(
          (item) => item.indexs == value
        );
        target.type = selectedvalue.value;
        this.chgclAddGroup = chgclAddGroup;
      }
      // this.postParams.append(this.chgclAddGroup);
    },
    selectUnitType(key, value) {
      console.log(value);
      const chgclAddGroup = [...this.chgclAddGroup];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        const selectedvalue = this.unitType.find(
          (item) => item.indexs == value
        );
        target.unit = selectedvalue.value;
        this.chgclAddGroup = chgclAddGroup;
      }
    },
    //选择工程人员
    selectStaff(key, value) {
      const mappingStaffGroup = [...this.mappingStaffGroup];
      const target = mappingStaffGroup.find((item) => item.key === key);
      if (target) {
        target.userName = value;
      }
    },
    //人员工程量更新
    updateStaff() {
      if (!this.mappingWorkPercentCheck(this.mappingStaffGroup)) {
        this.$notification.open({
          message: "工作量百分比总和错误",
          description: "工作量百分比总和应小于等于100%",
          onClick: () => {
            //console.log("Notification Clicked!");
          },
        });
        return;
      }
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      this.postParams.append(
        "dongbz",
        this.generateDongBZString(this.mappingStaffGroup)
      );
      axios
        .post(GLOBAL.env + "/qualitycheck/updateStaffGZL", this.postParams)
        .then((res) => {
          //console.log(res);
          if (res.data == "success") {
            this.$message.success("人员工作量更新成功");
            //this.$emit("uploadSuccess");
          }
        });
      console.log(
        "updateStaff",
        this.generateDongBZString(this.mappingStaffGroup)
      );
    },
    //人员工作量更新字符串
    generateDongBZString(userdata) {
      let tmp_str = "";
      if (userdata.length === 0) {
        return tmp_str;
      }
      userdata.forEach((element) => {
        tmp_str = tmp_str + element.UserName + "," + element.gzl + ";";
      });
      return tmp_str;
    },
    //工程量更新
    mappingWorkPercentCheck(userdata) {
      if (userdata.length === 0) {
        return true;
      }
      let percentSum = 0;
      userdata.forEach((element) => {
        percentSum = percentSum + Number(element.gzl);
      });
      if (percentSum <= 100) {
        return true;
      } else {
        return false;
      }
    },
    updateGCL() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      const updateData = this.generateGCLString(this.chgclAddGroup);
      this.postParams.append("zyd_gznr", updateData.projecttype);
      this.postParams.append("zyd_gcl", updateData.projectNumber);
      axios
        .post(GLOBAL.env + "/qualitycheck/updateGZL", this.postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("小组工作量更新成功");
          }
        });
    },
    generateGCLString(gcldata) {
      let tmpobj = { projecttype: "", projectNumber: "" };
      if (gcldata.length === 0) {
        return tmpobj;
      }
      gcldata.forEach((element) => {
        tmpobj.projecttype = tmpobj.projecttype + element.type + ",";
        tmpobj.projectNumber =
          tmpobj.projectNumber + element.number + element.unit + ";";
      });
      tmpobj.projecttype = tmpobj.projecttype.substring(
        0,
        tmpobj.projecttype.length - 1
      );
      return tmpobj;
    },
    //提交至下一步
    uploadProject() {
      this.updateGCL();
      this.updateStaff();

      let params = new URLSearchParams();
      params.append("projectsn", this.projectInfo);
      params.append(
        "spmanuserid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      axios
        .post(GLOBAL.env + "/resultapprovement/projectSendOut", params)
        .then((res) => {
          //console.log(res);
          //
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",审批->收费,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.qualitycheckOpinion;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  this.$message.success("提交成功");
                  this.$emit("updateSuccess");
                }
              });
          } else {
            this.$message.error("提交失败");
          }
        });
    },
    onDelete(key) {
      // this.postParams.append(key);
      const chgclAddGroup = [...this.chgclAddGroup];
      this.chgclAddGroup = chgclAddGroup.filter((item) => item.key !== key);
    },
    onDeleteStaffGZL(key) {
      const mappingStaffGroup = [...this.mappingStaffGroup];
      this.mappingStaffGroup = mappingStaffGroup.filter(
        (item) => item.key !== key
      );
    },
    addCustomerProjecttItem() {
      this.addProjectModalVisible = true;
    },
    addCustomerUnitItem() {
      this.addUnitModalVisible = true;
    },
    handleOk() {
      if (!this.projectTypeCustomer) {
        this.addProjectModalVisible = false;
        return;
      }
      this.addProjectModalVisible = false;
      const initDataLength = this.projectType.length + 1;
      let tmp_obj = {
        index: initDataLength,
        indexs: initDataLength.toString(),
        key: initDataLength.toString(),
        value: this.projectTypeCustomer,
      };
      this.projectType.push(tmp_obj);
      this.projectTypeCustomer = "";
      console.log(initDataLength);
    },
    handleUnitOk() {
      if (!this.unitTypeCustomer) {
        this.addUnitModalVisible = false;
        return;
      }
      this.addUnitModalVisible = false;
      const initDataLength = this.unitType.length + 1;
      let tmp_obj = {
        index: initDataLength,
        indexs: initDataLength.toString(),
        key: initDataLength.toString(),
        value: this.unitTypeCustomer,
      };
      this.unitType.push(tmp_obj);
      this.unitTypeCustomer = "";
    },
  },
  created: function() {
    this.getProjectInfo();
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
  .item {
    margin-top: 10px;
    .itemTitle {
    }
    .itemContainer {
    }
  }
  .splitLine {
    width: 100%;
    height: 1px;
    background-color: #d4d4d4;
    margin-top: 10px;
  }
}
.opinionContainer::-webkit-scrollbar-track {
}

.opinionContainer::-webkit-scrollbar {
  width: 5px;
}

.opinionContainer::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  margin-left: 20px;
  border-radius: 3px;
}
</style>
