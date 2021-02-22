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
        <a-button type="danger">
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
      axios
        .post(GLOBAL.env + "/sendout/projectSendOut", this.postParams)
        .then((res) => {
          console.log(res);
          this.$emit("childFn");
        });
      console.log("sendOut");
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
