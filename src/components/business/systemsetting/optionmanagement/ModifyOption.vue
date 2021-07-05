<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="projectInfo">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="名称" :span="1">
            <a-badge dot>
              <a-input
                placeholder="操作名称"
                :disabled="disableEdit"
                v-model="optionName"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="标识" :span="1">
            <a-badge dot>
              <a-input
                placeholder="操作标识"
                :disabled="disableEdit"
                v-model="optionTag"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="排序" :span="1">
            <a-badge dot>
              <a-input
                placeholder="操作排序"
                :disabled="disableEdit"
                v-model="optionOrder"
              >
                <a-tooltip slot="suffix" title="必填项目">
                  <a-icon type="info-circle" style="color: red" />
                </a-tooltip>
              </a-input>
            </a-badge>
          </a-descriptions-item>
          <a-descriptions-item label="说明" :span="1">
            <a-input
              placeholder="操作说明"
              :disabled="disableEdit"
              v-model="optionDescription"
            >
            </a-input>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="buttonGtoup">
        <div class="singlebutton">
          <a-button @click="cancelModifyOption">
            取消
          </a-button>
        </div>
        <div class="singlebutton">
          <a-button type="primary" @click="confirmModifyOption">
            确认
          </a-button>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import request from "@/utils/request";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
export default {
  props: ["selecteditem"],
  data() {
    return {
      disableEdit: false,
      optionName: "",
      optionTag: "",
      optionOrder: "",
      optionDescription: "",
      spinning: false,
    };
  },
  methods: {
    async getOptionInfo() {
      this.spinning = true;
      const data = await request.get(
        GLOBAL.env + "/optionmanagement/getoptiondetail",
        {
          params: {
            authorityid: this.selecteditem,
          },
        }
      );
      this.optionName = data.data[0].AuthorityName;
      this.optionTag = data.data[0].AuthorityTag;
      this.optionDescription = data.data[0].AuthorityDescription;
      this.optionOrder = data.data[0].AuthorityOrder;
      this.spinning = false;
    },
    cancelModifyOption() {
      this.$emit("cancelmodify");
    },
    confirmModifyOption() {
      if (this.optionName == "") {
        this.$message.warning("操作名称为必填项");
        return;
      }
      if (this.optionTag == "") {
        this.$message.warning("操作标识为必填项");
        return;
      }
      if (this.optionOrder == "") {
        this.$message.warning("操作排序为必填项");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("authorityid", this.selecteditem);
      postParams.append("authorityname", this.optionName);
      postParams.append("authoritydescription", this.optionDescription);
      postParams.append("authorityorder", this.optionOrder);
      postParams.append("authoritytag", this.optionTag);
      axios
        .post(GLOBAL.env + "/optionmanagement/modifyoption", postParams)
        .then((res) => {
          if (res.data == "success") {
            this.$message.success("修改成功");
          } else if (res.data == "existedorder") {
            this.$message.error("序号已经存在");
          } else {
            this.$message.error("修改失败");
          }
        });
    },
  },
  mounted: function() {
    this.getOptionInfo();
  },
};
</script>
<style lang="scss">
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small
  .ant-descriptions-item-content {
  padding: 4px 17px;
  //user-select: none;
}
.ant-modal-body {
  padding-top: 12px;
}
.ant-descriptions-title {
  margin-bottom: 10px;
}
.ant-modal-header {
  padding: 10px 24px;
}
.ant-badge {
  width: 100%;
}
.supportMaterials {
  width: 1110px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.buttonGtoup {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  .singlebutton {
    margin-right: 10px;
  }
}
</style>
