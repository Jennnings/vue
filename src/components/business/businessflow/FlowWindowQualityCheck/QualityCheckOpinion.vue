<template>
  <div>
    <a-card
      style="width:100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    >
      <div v-if="noTitleKey === 'qualitycheck'">
        <QualityCheckOpinionUploading
          v-bind:projectInfo="projectInfo"
          @updateSuccess="updateSuccess"
        />
      </div>
      <div v-else-if="noTitleKey === 'resultfile'">
        <FileDownload v-bind:projectInfo="projectInfo" />
      </div>
      <div v-else-if="noTitleKey === 'backtoformer'">
        <div class="backFormerContainer">
          <div class="titleContainer">
            <span>退回意见：</span>
          </div>
          <div class="contentContainer">
            <a-textarea
              placeholder="退回意见"
              :rows="4"
              v-model="sendBackOpinion"
            />
          </div>
          <div class="buttonContainer">
            <a-button type="danger" @click="sendBack">
              退回
            </a-button>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
import QualityCheckOpinionUploading from "./QualityCheckOpinionUploading";
import FileDownload from "./../common/ViewProjectInfo/FileDownload";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
import moment from "moment";
export default {
  props: ["projectInfo"],
  components: {
    QualityCheckOpinionUploading,
    FileDownload,
  },
  data() {
    return {
      tabListNoTitle: [
        {
          key: "qualitycheck",
          tab: "一级检查意见",
        },
        {
          key: "resultfile",
          tab: "成果文件",
        },
        {
          key: "backtoformer",
          tab: "退回意见",
        },
      ],
      noTitleKey: "qualitycheck",
      postParams: null,
      sendBackOpinion: "",
    };
  },
  methods: {
    moment,
    onTabChange(key, type) {
      this[type] = key;
    },
    sendBack() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      axios
        .post(GLOBAL.env + "/qualitycheck/projectSendBack", this.postParams)
        .then((res) => {
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",质检->派件,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.sendBackOpinion;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  this.$message.success("退回成功");
                  this.$emit("closemodal");
                }
              });
          } else {
            this.$message.error("退回失败");
          }
        });
    },
    updateSuccess() {
      this.$emit("closemodal");
    },
  },
};
</script>
<style lang="scss">
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
    margin-right: 10px;
  }
}
</style>
