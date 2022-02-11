<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="项目名称" :span="1">
            <a-input
              placeholder="项目名称"
              :disabled="disableEdit"
              v-model="projectName"
            >
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="当前状态" :span="1">
            <a-input
              placeholder="当前状态"
              :disabled="disableEdit"
              v-model="XMState"
            >
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item label="调度状态更改为" :span="1">
            <a-select
              style="width: 200px;height:32px"
              @change="projectStateSelection"
              size="default"
              :allowClear="true"
              v-if="projectState"
            >
              <a-select-option v-for="data in projectState" :key="data.index">
                {{ data.value }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
        </a-descriptions>
        <a-alert message="调度功能说明" type="warning" style="margin-top:10px">
          <p slot="description">
            由于项目归档及项目调度处理方法问题，调度已归档项目可能导致
            <span style="color: red">归档文件</span>
            无法在归档文件页面或成果文件中下载(显示<span style="color: red"
              >文件不存在</span
            >)。
          </p>
        </a-alert>
      </div>
    </a-spin>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelDispatchProject">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmDispatchProject">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import project_state from "./../../../../assets/menulist/project-state.json";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
import moment from "moment";
const projectStateData = project_state;
export default {
  props: ["selecteditem"],
  data() {
    return {
      projectName: "",
      XMState: "",
      disableEdit: true,
      projectState: projectStateData.data,
      dispatchProjectState: "",
      spinning: false,
    };
  },
  methods: {
    moment,
    initProject() {
      this.spinning = true;
      let that = this;
      axios
        .get(GLOBAL.env + "/dispatchmanagement/getprojectinfo", {
          params: {
            projectsid: this.selecteditem,
          },
        })
        .then((res) => {
          that.projectName = res.data[0].projectname;
          console.log(res.data[0].XMstate);
          if (res.data[0].XMstate == "1") {
            this.XMState = "登记中";
          }
          if (res.data[0].XMstate == "2") {
            this.XMState = "派件中";
          }
          if (res.data[0].XMstate == "3") {
            this.XMState = "测绘中";
          }
          if (res.data[0].XMstate == "4") {
            this.XMState = "一级检查";
          }
          if (res.data[0].XMstate == "5") {
            this.XMState = "二级检查";
          }
          if (res.data[0].XMstate == "6") {
            this.XMState = "收费中";
          }
          if (res.data[0].XMstate == "7") {
            this.XMState = "归档中";
          }
          if (res.data[0].XMstate == "8") {
            this.XMState = "已归档";
          }
          if (res.data[0].XMstate == "9") {
            this.XMState = "审核中";
          }

          console.log(this.XMState);
        });
      this.spinning = false;
    },
    projectStateSelection(value) {
      this.dispatchProjectState = value;
      if (value == undefined) {
        this.dispatchProjectState = "";
      }
      console.log(this.dispatchProjectState);
    },
    cancelDispatchProject() {
      this.$emit("canceldispatch");
    },
    confirmDispatchProject() {
      if (this.dispatchProjectState == "") {
        this.$message.warning("请选择该项目需要变更的状态");
      }
      let postParams = new URLSearchParams();
      postParams.append("xmstate", this.dispatchProjectState);
      postParams.append("projectid", this.selecteditem);
      axios
        .post(GLOBAL.env + "/dispatchmanagement/dispatchproject", postParams)
        .then((res) => {
          if (res.data[0].result == "success") {
            let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
            let clgc_str =
              res.data[0].datas +
              "\\n#" +
              time_str +
              ",管理员调度:" +
              this.XMState +
              "->" +
              this.changeXMStateCode(this.dispatchProjectState) +
              ",办理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",:";
            let clgcUpdateParams = new URLSearchParams();
            clgcUpdateParams.append("clgc", clgc_str);
            clgcUpdateParams.append("projectid", this.selecteditem);
            axios
              .post(
                GLOBAL.env + "/dispatchmanagement/resultinsert",
                clgcUpdateParams
              )
              .then((res) => {
                if (res.data == "success") {
                  this.$message.success("调度成功");
                  this.initProject();
                } else {
                  this.$message.error("调度失败");
                }
              });
          } else {
            this.$message.error("调度失败");
          }
        });
    },
    changeXMStateCode(xmstate_code) {
      if (xmstate_code == "1") {
        return "登记中";
      }
      if (xmstate_code == "2") {
        return "派件中";
      }
      if (xmstate_code == "3") {
        return "测绘中";
      }
      if (xmstate_code == "4") {
        return "一级检查";
      }
      if (xmstate_code == "5") {
        return "二级检查";
      }
      if (xmstate_code == "6") {
        return "收费中";
      }
      if (xmstate_code == "7") {
        return "归档中";
      }
      if (xmstate_code == "8") {
        return "已归档";
      }
      if (xmstate_code == "9") {
        return "审核中";
      }
    },
  },
  mounted: function() {
    this.initProject();
  },
};
</script>
<style lang="scss"></style>
