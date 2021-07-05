<template>
  <div class="historyfileListContainer">
    <a-list item-layout="horizontal" :data-source="historyFile">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- <a-list-item-meta description=""> -->

        <div>
          <span>{{ item.uploadtime }}</span
          ><br />
          <div v-for="file in item.filelist" :key="file">
            <a @click="downHistoryFile(file)">{{ file }}</a>
          </div>
        </div>
        <!-- </a-list-item-meta> -->
      </a-list-item>
    </a-list>
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
      historyFile: [],
    };
  },
  methods: {
    async getHistoryFile() {
      const tmp_data = await request.get(
        GLOBAL.env + "/common/gethistroyfile",
        {
          params: {
            projectsn: this.projectInfo,
          },
        }
      );
      tmp_data.data.forEach((element) => {
        let tmp_data = { uploadtime: "", filelist: [] };
        tmp_data.uploadtime = element.uploadtime;
        tmp_data.filelist = element.filename.split("/");
        this.historyFile.push(tmp_data);
      });
      //this.historyFile = tmp_data.data;
      console.log(this.historyFile);
    },
    async downHistoryFile(item) {
      const tmp_data = await request.get("/common/downloadfile", {
        params: {
          postfilename: item,
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
          postfilename: item,
        },
      }).then((response) => {
        //console.log(response);

        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
  },
  mounted: function() {
    this.getHistoryFile();
  },
};
</script>
<style lang="scss">
.historyfileListContainer {
  max-height: 600px;
  overflow-y: auto;
}
</style>
