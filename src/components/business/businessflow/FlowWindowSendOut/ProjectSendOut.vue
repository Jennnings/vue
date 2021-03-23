<template>
  <div class="container_box">
    <div class="itemcontainer itemcontainer_top">
      <div class="item-title">
        <span>
          分配意见
        </span>
      </div>
      <div class="item-content">
        <div>
          测绘承办人:
          <a-select
            style="width: 120px"
            @change="selectChUserChange"
            size="small"
            v-if="userData"
          >
            <a-select-option v-for="user in userData" :key="user.UserID">
              {{ user.UserName }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          意见如下:
        </div>
        <div>
          <a-textarea
            :rows="3"
            style="width: 350px;"
            v-model="sendOutOpinion"
          />
        </div>
      </div>
      <div class="item-option">
        <a-button type="primary" @click="sendOutFunction">
          分配
        </a-button>
      </div>
    </div>
    <div class="itemcontainer">
      <div class="item-title">
        <span>
          退回意见
        </span>
      </div>
      <div class="item-content">
        <div>
          意见如下:
        </div>
        <div>
          <a-textarea
            :rows="3"
            style="width: 350px;"
            v-model="sendBackOpinion"
          />
        </div>
      </div>
      <div class="item-option">
        <a-button type="danger" @click="sendBack">
          退回
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
import moment from "moment";
export default {
  props: ["projectInfo"],
  data() {
    return {
      userData: null,
      sendOutOpinion: "请按照作业规范执行。",
      sendBackOpinion: "",
      sendOutUserID: "",
      postParams: null,
    };
  },
  methods: {
    moment,
    async getchUsers() {
      const user = await request.get("/sendout/getchUsers");
      this.userData = user.data;
    },
    selectChUserChange(value) {
      console.log(`selected ${value}`);
      this.sendOutUserID = value;
    },
    sendOutFunction() {
      if (this.sendOutUserID === "") {
        this.$message.warn("请选择测绘承办人");
        return;
      }
      this.postParams = new URLSearchParams();
      this.postParams.append("projectSn", this.projectInfo);
      this.postParams.append("clmanUserID", this.sendOutUserID);
      this.postParams.append("clyj", this.sendOutOpinion);
      this.postParams.append(
        "pjmanuserid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      axios
        .post(GLOBAL.env + "/sendout/projectSendOut", this.postParams)
        .then((res) => {
          let tmp_result = res.data[0];
          if (tmp_result.result === "success") {
            let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",派件->测绘,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",测绘负责人:" +
              this.userData.find((item) => item.UserID === this.sendOutUserID)
                .UserName +
              ",意见:" +
              this.sendOutOpinion;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  this.$message.success("派件成功");
                  this.$emit("childFn");
                }
              });
          } else {
            this.$message.error("项目派件失败");
          }
        });
      console.log("sendOut");
    },
    sendBack() {
      this.postParams = new URLSearchParams();
      this.postParams.append("projectsn", this.projectInfo);
      axios
        .post(GLOBAL.env + "/sendout/projectSendBack", this.postParams)
        .then((res) => {
          let tmp_result = res.data[0];
          if (tmp_result.result === "success") {
            let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",派件->登记,处理人:" +
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
                  this.$emit("childFn");
                }
              });
          } else {
            this.$message.error("退回失败");
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
.container_box {
  width: 100%;
  height: 300px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  border: 1px #0c0c0c46 solid;
  border-radius: 3px;
  .itemcontainer {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    .item-title {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      border-right: 1px #0c0c0c46 solid;
    }
    .item-content {
      display: flex;
      flex-direction: column;
      //align-items: center;
      justify-content: center;
      padding: 5px 0px 5px 10px;
    }
    .item-option {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      border-left: 1px #0c0c0c46 solid;
    }
  }
  .itemcontainer_top {
    border-bottom: 1px #0c0c0c46 solid;
  }
}
</style>
