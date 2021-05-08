<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="合同信息修改">
        <ModifyContract :selectid="projectInfo" @childFn="modifyParentFn" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="发票信息">
        <ViewContractModalForContract :contractinfo="projectInfo" />
      </a-tab-pane>
    </a-tabs></div
></template>
<script>
import ModifyContract from "./ModifyContract";
import ViewContractModalForContract from "./Receipt/ViewReceiptModalForContract";
import ChartView from "./ChartView";
export default {
  components: { ModifyContract, ViewContractModalForContract },
  props: ["projectInfo"],
  data() {
    return {
      xmstatement: "",
      spinning: false,
    };
  },
  methods: {
    callback(key) {},
    modifyParentFn() {
      this.$emit("childFn");
    },
  },
};
</script>
<style lang="scss"></style>
