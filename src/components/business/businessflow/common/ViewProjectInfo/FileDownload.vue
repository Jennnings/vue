<template>
  <div>
    <a-empty v-if="!fileListInfo.length" />
    <div v-else>
      <div
        class="fileListContainer"
        v-for="(items, index) in fileListInfo"
        :key="index"
      >
        <div class="leftInfo">
          <img v-bind:src="items.imgurl" />
        </div>
        <div class="centerInfo">
          <span>{{ items.filename }}</span>
        </div>
        <div class="rightInfo">
          <a-button type="primary" @click="downloadFile(items)">
            文件下载
          </a-button>
        </div>
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
    return {
      imgurl: require("./../../../../../assets/img/filetype/doc.png"),
      fileListInfo: [],
    };
  },
  methods: {
    async getFileList() {
      const tmp_data = await request.get("/common/getfilelist", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      if (tmp_data.data == "") {
        this.fileListInfo = [];
      } else {
        let tmpfilelist = tmp_data.data.split("\/");
        for (let i = 0; i < tmpfilelist.length; i++) {
          let tmp_obj = {};
          if (tmpfilelist[i].indexOf("doc") != -1) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/doc.png");
          }
          if (tmpfilelist[i].indexOf("dwg") != -1) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/dwg.png");
          }
          if (tmpfilelist[i].indexOf("pdf") != -1) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/pdf.png");
          }
          if (
            tmpfilelist[i].indexOf("rar") != -1 ||
            tmpfilelist[i].indexOf("zip") != -1
          ) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/rar.png");
          }
          if (tmpfilelist[i].indexOf("txt") != -1) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/txt.png");
          }
          if (tmpfilelist[i].indexOf("xls") != -1) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/xls.png");
          }
          if (
            tmpfilelist[i].indexOf("png") != -1 ||
            tmpfilelist[i].indexOf("jpg") != -1
          ) {
            tmp_obj[
              "imgurl"
            ] = require("./../../../../../assets/img/filetype/doc.png");
          }
          tmp_obj["filename"] = tmpfilelist[i];
          this.fileListInfo.push(tmp_obj);
        }
      }
    },
    async downloadFile(item) {
      console.log(item.filename);
      const tmp_data = await request.get("/common/downloadfile", {
        params: {
          postfilename: item.filename,
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
          postfilename: item.filename,
        },
      }).then((response) => {
        console.log(response);

        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item.filename);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
  },
  mounted: function() {
    this.getFileList();
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
