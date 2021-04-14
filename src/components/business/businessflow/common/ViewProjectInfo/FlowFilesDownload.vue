<template>
  <div>
    <div class="fileListContainer">
      <div class="leftInfo"></div>
      <div class="centerInfo">
        <span>流程记录单</span>
      </div>
      <div class="rightInfo">
        <a-button type="primary" @click="downloadFile('lcjld')">
          文件下载
        </a-button>
      </div>
    </div>
    <div class="fileListContainer">
      <div class="leftInfo"></div>
      <div class="centerInfo">
        <span>质检记录单</span>
      </div>
      <div class="rightInfo">
        <a-button type="primary" @click="downloadFile('zjjld')">
          文件下载
        </a-button>
      </div>
    </div>
    <div class="fileListContainer">
      <div class="leftInfo"></div>
      <div class="centerInfo">
        <span>项目委托单(代合同)</span>
      </div>
      <div class="rightInfo">
        <a-button type="primary" @click="downloadFile('xmwtd')">
          文件下载
        </a-button>
      </div>
    </div>
    <div class="fileListContainer">
      <div class="leftInfo"></div>
      <div class="centerInfo">
        <span>缴款单</span>
      </div>
      <div class="rightInfo">
        <a-button type="primary" @click="downloadFile('jkd')">
          文件下载
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../../utils/global_variable";
import axios from "axios";
export default {
  props: ["projectInfo"],
  data() {
    return {};
  },
  methods: {
    async downloadFile(item) {
      axios({
        url: GLOBAL.env + "/relatedfiles/" + item,
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          projectsn: this.projectInfo,
          userid: JSON.parse(sessionStorage.getItem("userToken")).UserID,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item.toUpperCase() + ".xlsx");
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
  },
};
</script>
<style lang="scss">
.fileListContainer {
  height: 70px;
  width: 100%;
  position: relative;
  margin-top: 10px;
  border: #dadada 1px solid;
  border-radius: 5px;
  .leftInfo {
    width: fit-content;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    img {
      height: 30px;
    }
  }
  .centerInfo {
    width: fit-content;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    font-size: 15px;
    margin-left: 10px;
  }
  .rightInfo {
    margin-right: 10px;
    width: 100px;
    height: 100%;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
