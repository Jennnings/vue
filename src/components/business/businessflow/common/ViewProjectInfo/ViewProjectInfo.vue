<template>
  <a-spin :spinning="spinning">
    <div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="项目信息">
          <ProjectInfoDetail v-bind:projectInfo="projectInfo" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="处理记录" force-render>
          <ProcessRecording v-bind:projectInfo="projectInfo" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="流程文件">
          <FlowFilesDownload v-bind:projectInfo="projectInfo" />
        </a-tab-pane>

        <a-tab-pane key="4" tab="测绘成果" v-if="xmstatement != 8">
          <FileDownload v-bind:projectInfo="projectInfo" />
        </a-tab-pane>
        <a-tab-pane key="5" tab="归档文件" v-if="xmstatement == 8">
          <GDFileDownload v-bind:projectInfo="projectInfo" />
        </a-tab-pane>
        <a-tab-pane key="6" tab="历史文件">
          <HistroyFile v-bind:projectInfo="projectInfo" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>
</template>
<script>
import ProcessRecording from "./ProcessRecording";
import FileDownload from "./FileDownload";
import ProjectInfoDetail from "./ProjectInfoDetail";
import FlowFilesDownload from "./FlowFilesDownload";
import GDFileDownload from "./GDFileDownload";
import HistroyFile from "./HistroyFile";
import request from "@/utils/request";
import GLOBAL from "./../../../../../utils/global_variable";
export default {
  components: {
    ProcessRecording,
    FileDownload,
    ProjectInfoDetail,
    FlowFilesDownload,
    GDFileDownload,
    HistroyFile,
  },
  props: ["projectInfo"],
  data() {
    return {
      xmstatement: "",
      spinning: false,
    };
  },
  methods: {
    callback(key) {
      //console.log(key);
    },
    async getProjectState() {
      this.spinning = true;
      const tmp_data = await request.get(GLOBAL.env + "/common/getxmstate", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      this.xmstatement = tmp_data.data;
      console.log(this.xmstatement);
      this.spinning = false;
    },
  },
  created: function() {
    this.getProjectState();
  },
};
</script>
