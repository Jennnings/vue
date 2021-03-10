<template>
  <div class="container_box">
    <div class="itemcontainer itemcontainer_top">
      <div class="item-title">
        <span>
          项目归档
        </span>
      </div>
      <div class="item-content">
        <div>
          <span>归档顺序号:</span>
          <br />
          <a-input
            placeholder="项目归档号"
            v-model="recordindex"
            style="width:250px;margin-top:15px"
          />
          <br />
          <div style="margin-top:10px">
            <span style="margin-top:15px"
              >本年度已有最大顺序号：<span style="color:red">{{
                maxRecordIndex
              }}</span></span
            >
          </div>
          <!-- <br />
          <span>页码数:</span>
          <br />
          <a-input
            placeholder="页码数"
            v-model="pageNumber"
            style="width:250px;margin-top:15px"
          /> -->
        </div>
      </div>
      <div class="item-option">
        <a-button type="primary" @click="sendOutFunction">
          提交归档
        </a-button>
      </div>
    </div>
    <div class="itemcontainer">
      <div class="item-title">
        <span>
          退回收费
        </span>
      </div>
      <div class="item-content">
        <!-- <div>
          意见如下:
        </div>
        <div>
          <a-textarea
            :rows="3"
            style="width: 350px;"
            v-model="sendBackOpinion"
          />
        </div> -->
      </div>
      <div class="item-option">
        <a-button type="danger" @click="sendBack">
          退回收费
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
      maxRecordIndex: "",
      sendBackOpinion: "",
      recordindex: "",
      pageNumber: "",
    };
  },
  methods: {
    async getMaxRecordIndex() {
      const tmp_data = await request.get("recordproject/getmaxrecordindex");
      console.log(tmp_data);
      this.maxRecordIndex = tmp_data.data;
    },
    sendBack() {
      let postParams = new URLSearchParams();
      postParams.append("projectsn", this.projectInfo);
      axios
        .post(GLOBAL.env + "/recordproject/sendbackproject", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("项目退回成功");
            this.$emit("updateSuccess");
          }
        });
    },
    sendOutFunction() {
      let postParams = new URLSearchParams();
      postParams.append("projectsn", this.projectInfo);
      axios
        .post(GLOBAL.env + "/recordproject/projectupload", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("项目提交成功");
            this.$emit("updateSuccess");
          }
        });
    },
  },
  mounted: function() {
    this.getMaxRecordIndex();
  },
};
</script>
<style lang="scss">
.container_box {
  width: 100%;
  height: 300px;
  display: grid;
  grid-template-rows: 1.5fr 0.5fr;
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
