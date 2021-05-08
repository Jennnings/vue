<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="合同信息">
        <ViewContract :selectid="projectInfo" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="收费信息">
        <ChartView :selectid="projectInfo" />
      </a-tab-pane>
    </a-tabs></div
></template>
<script>
import ViewContract from "./ViewContract";
import ChartView from "./ChartView";
export default {
  components: { ViewContract, ChartView },
  props: ["projectInfo"],
  data() {
    return {
      xmstatement: "",
      spinning: false,
    };
  },
  methods: {
    callback(key) {},
  },
};
</script>
<style lang="scss"></style>
