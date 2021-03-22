<template>
  <div>
    <div v-if="processInfo">
      <a-list
        item-layout="horizontal"
        :data-source="showItems"
        style="margin-left:15px"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <span slot="description"
              >{{ item.option
              }}<span style="margin-left:10px">{{ item.otherinfo }}</span></span
            >
            <span slot="title">{{ item.time }}</span>
            <a-avatar :size="48" slot="avatar">{{ item.user }} </a-avatar>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../../utils/global_variable";
export default {
  props: ["projectInfo"],
  data() {
    return {
      processInfo: [],
      showItems: [],
    };
  },
  methods: {
    async getProcessRecording() {
      const tmp_data = await request.get(
        GLOBAL.env + "/common/getprocessrecord",
        {
          params: {
            projectsn: this.projectInfo,
          },
        }
      );
      if (tmp_data.data == "None") {
        this.processInfo = [];
        return;
      }
      this.processInfo = tmp_data.data.split("\\n#");
      this.processInfo.forEach((e) => {
        if (e !== "") {
          let tmp_obj = {};
          if (e.split(",").length === 5) {
            tmp_obj["time"] = e.split(",")[0];
            tmp_obj["option"] = e.split(",")[1];
            tmp_obj["user"] = e.split(",")[2].split(":")[1];
            tmp_obj["otherinfo"] = e.split(",")[3] + "\t" + e.split(",")[4];
          } else {
            tmp_obj["time"] = e.split(",", 4)[0];
            tmp_obj["option"] = e.split(",", 4)[1];
            tmp_obj["user"] = e.split(",", 4)[2].split(":")[1];
            tmp_obj["otherinfo"] = e.split(",", 4)[3];
          }
          this.showItems.push(tmp_obj);
        }
      });
    },
  },
  mounted: function() {
    this.getProcessRecording();
  },
};
</script>
