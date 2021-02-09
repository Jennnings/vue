<template>
  <div>
    <div class="projectInfo">
      <a-descriptions title="项目信息" bordered :column="2" size="small">
        <a-form-item label="项目名称" :span="1">
          <a-badge dot>
            <a-input
              placeholder="项目名称"
              name="projectname"
              v-model="params.projectName"
              aria-required="true"
              autocomplete="off"
            >
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-form-item>
        <a-descriptions-item label="委托单位" :span="1">
          <a-badge dot>
            <a-input placeholder="委托单位" v-model="params.projectClient">
              <a-tooltip slot="suffix" title="必填项目">
                <a-icon type="info-circle" style="color: red" />
              </a-tooltip>
            </a-input>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="委托时间" :span="1">
          <a-badge dot>
            <a-date-picker style="width:100%" @change="getcreateTime" />
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="委托单位地址" :span="1">
          <a-input placeholder="委托单位地址" />
        </a-descriptions-item>
        <a-descriptions-item label="委托人" :span="1">
          <a-input placeholder="委托人" />
        </a-descriptions-item>
        <a-descriptions-item label="委托人电话" :span="1">
          <a-input placeholder="委托人电话" />
        </a-descriptions-item>
        <a-descriptions-item label="联系人" :span="1">
          <a-input placeholder="联系人" />
        </a-descriptions-item>
        <a-descriptions-item label="联系人电话" :span="1">
          <a-input placeholder="联系人电话" />
        </a-descriptions-item>
        <a-descriptions-item label="合同编号" :span="1">
          <a-input placeholder="合同编号" />
        </a-descriptions-item>
        <a-descriptions-item label="合同名称" :span="1">
          <a-input placeholder="合同名称" />
        </a-descriptions-item>
        <a-descriptions-item label="项目类型" :span="2">
          <a-badge dot>
            <a-checkbox-group>
              <div class="supportMaterials">
                <div v-for="data in projectType" :key="data.index">
                  <a-checkbox :value="data.key">
                    {{ data.value }}
                  </a-checkbox>
                </div>
              </div>
            </a-checkbox-group>
          </a-badge>
        </a-descriptions-item>
        <a-descriptions-item label="现场坐落" :span="1">
          <a-input placeholder="现场坐落" />
        </a-descriptions-item>
        <a-descriptions-item label="希望进场时间" :span="1">
          <a-date-picker style="width:100%" />
        </a-descriptions-item>
        <a-descriptions-item label="其他要求" :span="2">
          <a-textarea placeholder="其他要求" :rows="3" />
        </a-descriptions-item>
        <a-descriptions-item label="资料清单" :span="2">
          <a-checkbox-group>
            <div class="supportMaterials">
              <div v-for="data in otherMaterial" :key="data.index">
                <a-checkbox :value="data.key">
                  {{ data.value }}
                </a-checkbox>
              </div>
            </div>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="文件上传" :span="2">
          <div class="clearfix">
            <div class="tempFile">
              <a-upload
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
              >
                <a-button> <a-icon type="upload" /> 选择文件 </a-button>
              </a-upload>
            </div>
            <div class="tempFile">
              <a-button
                type="primary"
                :disabled="fileList.length === 0"
                :loading="uploading"
                style="margin-top: 16px"
                @click="handleUpload"
              >
                {{ uploading ? "正在上传..." : "开始上传" }}
              </a-button>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="buttonGtoup">
      <div class="singlebutton">
        <a-button @click="cancelProjectCreate">
          取消
        </a-button>
      </div>
      <div class="singlebutton">
        <a-button type="primary" @click="confirmProjectCreate">
          确认
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import listdata from "../../../../assets/menulist/other-material.json";
import projectdata from "../../../../assets/menulist/project-type.json";
import axios from "axios";
const listData = listdata;
const projectData = projectdata;
export default {
  name: "create-project",
  data() {
    return {
      fileList: [],
      uploading: false,
      otherMaterial: listData.data,
      projectType: projectData.data,
      params: {
        projectName: "",
        projectClient: "",
        createTime: "",
      },
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  methods: {
    confirmProjectCreate() {
      console.log("create Project");
      console.log(this.otherMaterial);
      this.$emit("childFn");
    },
    cancelProjectCreate() {
      console.log("cancel Project");
      this.$emit("childFn");
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    getcreateTime(date, dateString) {
      this.params.createTime = dateString;
    },
    //文件上传前端
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("myfile", file);
      });
      this.uploading = true;
      axios
        .post("http://127.0.0.1:8000/cxch/uploadfile", formData)
        .then((res) => {
          console.log(res);
          if (res.data === "upload over") {
            this.$message.success("上传成功");
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
  },
};
</script>
<style lang="scss">
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small
  .ant-descriptions-item-content {
  padding: 4px 17px;
  user-select: none;
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
