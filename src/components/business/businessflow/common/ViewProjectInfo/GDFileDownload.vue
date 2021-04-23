<template>
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
      filePath1: "",
      filePath2: "",
    };
  },
  methods: {
    async getFileList() {
      const tmp_data = await request.get("/common/getrecordedfiles", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      if (tmp_data.data[0].fileInfo == "") {
        this.fileListInfo = [];
      } else {
        let tmpfilelist = tmp_data.data[0].fileInfo.split("\/");
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
      this.filePath1 = tmp_data.data[0].filePath1;
      this.filePath2 = tmp_data.data[0].filePath2;
    },
    async downloadFile(item) {
      //console.log(item.filename);
      const tmp_data = await request.get("/common/recordedfiledownload", {
        params: {
          postfilename: item.filename,
          filepath1: this.filePath1,
          filepath2: this.filePath2,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/recordedfiledownload",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          postfilename: item.filename,
          filepath1: this.filePath1,
          filepath2: this.filePath2,
        },
      }).then((response) => {
        //console.log(response);

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
<style></style>
