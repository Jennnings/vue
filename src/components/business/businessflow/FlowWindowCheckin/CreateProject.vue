<template>
  <div>
    <div class="projectInfo">
      <a-descriptions title="项目信息" bordered :column="2" size="small">
        <a-descriptions-item label="项目名称" :span="1">
          <a-input placeholder="项目名称" />
        </a-descriptions-item>
        <a-descriptions-item label="委托单位" :span="1">
          <a-input placeholder="委托单位" />
        </a-descriptions-item>
        <a-descriptions-item label="委托时间" :span="1">
          <a-input placeholder="委托时间" />
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
          <a-checkbox-group>
            <a-row>
              <a-col :span="3">
                <a-checkbox value="A">
                  面积预测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="B">
                  面积实测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="C">
                  人防预测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="D">
                  人防实测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  施工放样
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="A">
                  竣工测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="B">
                  控制测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="C">
                  日照测量
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="3">
                <a-checkbox value="D">
                  管线测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  土方测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  断面测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  地形测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  形变测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  宗地调查
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  其他测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  分户调查
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  土地分割
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
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
            <a-row>
              <a-col :span="3">
                <a-checkbox value="A">
                  面积预测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="B">
                  面积实测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="C">
                  人防预测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="D">
                  人防实测
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  施工放样
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="A">
                  竣工测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="B">
                  控制测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="C">
                  日照测量
                </a-checkbox>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="3">
                <a-checkbox value="D">
                  管线测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  土方测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  断面测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  地形测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  形变测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  宗地调查
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  其他测量
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  分户调查
                </a-checkbox>
              </a-col>
              <a-col :span="3">
                <a-checkbox value="E">
                  土地分割
                </a-checkbox>
              </a-col>
            </a-row>
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
export default {
  name: "create-project",
  data() {
    return {
      fileList: [],
      uploading: false,
    };
  },
  methods: {
    confirmProjectCreate() {
      console.log("create Project");
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
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files[]", file);
      });
      this.uploading = true;

      // You can use any AJAX library you like
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
.buttonGtoup {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  .singlebutton {
    margin-right: 10px;
  }
}
</style>
