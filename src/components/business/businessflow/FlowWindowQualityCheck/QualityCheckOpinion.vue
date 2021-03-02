<template>
  <div>
    <a-card
      style="width:100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    >
      <div v-if="noTitleKey === 'qualitycheck'">
        <QualityCheckOpinionUploading v-bind:projectInfo="projectInfo" />
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
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
export default {
  props: ["projectInfo"],
  components: {
    QualityCheckOpinionUploading,
  },
  data() {
    return {
      tabListNoTitle: [
        {
          key: "qualitycheck",
          tab: "质检意见",
        },
        {
          key: "backtoformer",
          tab: "退回意见",
        },
      ],
      noTitleKey: "qualitycheck",
      postParams: null,
    };
  },
  methods: {
    onTabChange(key, type) {
      this[type] = key;
    },
    sendBack() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      axios
        .post(GLOBAL.env + "/qualitycheck/projectSendBack", this.postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("退回成功");
            this.$emit("closemodal");
          }
        });
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
