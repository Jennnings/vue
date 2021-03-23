<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="项目信息">
        <ProjectInfoEdit
          :projectInfo="projectInfo"
          :XMState="XMState"
          @childFn="parentFn"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="处理记录" force-render>
        <ProcessRecording v-bind:projectInfo="projectInfo" />
      </a-tab-pane>
      <!-- <a-tab-pane key="3" tab="文件下载">
        <FileDownload v-bind:projectInfo="projectInfo" />
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>
<script>
import ProcessRecording from "./../ViewProjectInfo/ProcessRecording";
import ProjectInfoEdit from "./ProjectInfoEdit";
export default {
  components: {
    ProcessRecording,
    ProjectInfoEdit,
  },
  props: ["projectInfo", "XMState"],
  data() {
    return {};
  },
  methods: {
    callback(key) {},
    parentFn() {
      this.$emit("childFn");
    },
  },
};
</script>
