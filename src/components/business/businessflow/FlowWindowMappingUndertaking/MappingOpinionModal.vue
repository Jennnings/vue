<template>
  <div>
    <a-card
      style="width:100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    >
      <div v-if="noTitleKey === 'undertaking'">
        <MappingOpinionUploading
          v-bind:projectInfo="projectInfo"
          @uploadSuccess="postSuccess"
        />
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
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
import MappingOpinionUploading from "./MappingOpinionUploading";
export default {
  props: ["projectInfo"],
  components: {
    //MappingOpinionEditableTable,
    MappingOpinionUploading,
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
      postParams: null,
    };
  },
  methods: {
    async getchUsers() {
      const user = await request.get("/mappingundertaking/getchUsers");
      this.userData = user.data;
    },
    onTabChange(key, type) {
      this[type] = key;
    },
    postSuccess() {
      this.$emit("modalClose");
    },
    sendBack() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      axios
        .post(
          GLOBAL.env + "/mappingundertaking/projectSendBack",
          this.postParams
        )
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("退回成功");
            this.$emit("modalClose");
          }
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
    margin-top: 10px;
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
    margin-right: 10px;
  }
}
</style>
