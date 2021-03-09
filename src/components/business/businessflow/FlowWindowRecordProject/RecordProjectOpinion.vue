<template>
  <div>
    项目{{ projectInfo }}<br />
    最大归档号{{ maxRecordIndex }}
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  props: ["projectInfo"],
  data() {
    return {
      maxRecordIndex: "",
    };
  },
  methods: {
    async getMaxRecordIndex() {
      const tmp_data = await request.get("recordproject/getmaxrecordindex");
      console.log(tmp_data);
      this.maxRecordIndex = tmp_data.data;
    },
  },
  mounted: function() {
    this.getMaxRecordIndex();
  },
};
</script>
