<template>
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
      <a-tab-pane key="4" tab="测绘成果">
        <FileDownload v-bind:projectInfo="projectInfo" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import ProcessRecording from "./ProcessRecording";
import FileDownload from "./FileDownload";
import ProjectInfoDetail from "./ProjectInfoDetail";
import FlowFilesDownload from "./FlowFilesDownload";
export default {
  components: {
    ProcessRecording,
    FileDownload,
    ProjectInfoDetail,
    FlowFilesDownload,
  },
  props: ["projectInfo"],
  data() {
    return {};
  },
  methods: {
    callback(key) {
      //console.log(key);
    },
  },
};
</script>
