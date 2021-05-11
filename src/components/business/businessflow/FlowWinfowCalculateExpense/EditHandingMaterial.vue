<template>
  <div class="opinionContainer">
    <a-spin :spinning="spinning">
      <div class="item">
        <div class="itemTitle">
          交接信息
        </div>
        <div class="itemContainer">
          <div class="smallItem">
            <div class="itembox">
              <span>交接人</span>
              <a-input
                style="width:240px;margin-left:10px"
                v-model="handingManName"
              ></a-input>
            </div>
            <div class="itembox">
              <span>交接人联系方式</span>
              <a-input
                style="width:240px;margin-left:10px"
                v-model="handingManPhone"
              ></a-input>
            </div>
          </div>
        </div>
        <div class="itemContainer">
          <div class="smallItem">
            <div class="itembox">
              <!-- <span></span> -->
              <span>创建时间</span>
              <a-date-picker
                @change="handingTimeChange"
                v-if="handingTimeDate"
                style="margin-left:20px"
                :default-value="moment(handingTimeDate, 'YYYY-MM-DD')"
                :allowClear="false"
              />
            </div>

            <div class="itembox">
              <a-checkbox
                :checked="officalSealChecked"
                @change="onOfficakSealChange"
              >
                使用公章
              </a-checkbox>
              <a-checkbox
                :checked="priceInfoChecked"
                @change="onPriceInfoChange"
              >
                价格信息
              </a-checkbox>
              <a-checkbox :checked="isformerReturn" @change="onformerReturn">
                原报告回收
              </a-checkbox>
            </div>
          </div>
        </div>
        <div class="itemContainer">
          <div class="smallItem">
            <div class="itembox">
              <!-- <span></span> -->
              <span>交接时间</span>
              <a-input
                style="width:240px;margin-left:10px"
                v-model="sendTime"
                disabled
              ></a-input>
            </div>

            <div class="itembox"></div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="itemTitle">
          <span>
            交接内容
          </span>
          <a-button
            class="editable-add-btn"
            size="small"
            style="margin-left:10px"
            @click="handlegroupDataGCLTableAdd"
          >
            添 加
          </a-button>
        </div>
        <div class="itemContainer">
          <a-table
            :columns="groupcolumns"
            :data-source="handingMaterialTableData"
            style="margin-top:10px"
            bordered
          >
            <template slot="materialName" slot-scope="text, record">
              <ExpenseOpinionEditableTable
                :text="text"
                @change="
                  onMaterialDataDataChange(record.key, 'materialName', $event)
                "
              />
            </template>
            <template slot="materialCount" slot-scope="text, record">
              <ExpenseOpinionEditableTable
                :text="text"
                @change="
                  onMaterialDataDataChange(record.key, 'materialCount', $event)
                "
              />
            </template>
            <template slot="userOperation" slot-scope="text, record">
              <a-popconfirm
                v-if="handingMaterialTableData.length"
                title="是否确认删除?"
                @confirm="() => deleteHandingOverMaterial(record.key)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
      <div class="item">
        <div class="itemTitle">
          <span>交接文件</span>
          <div class="uploadFileConainer">
            <a-list
              size="small"
              bordered
              :data-source="uploadedFileList"
              style="width:100%"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a @click="downloadFile(item)">{{ item }}</a>
                <div slot="actions">
                  <a-popconfirm
                    title="是否确认删除？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteSelectItem(item)"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </a-list-item>
            </a-list>
            <div class="smallItems" style="margin-top:10px">
              <div>
                <a-upload
                  :file-list="fileList"
                  :remove="handleRemove"
                  :before-upload="beforeUpload"
                >
                  <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                </a-upload>
                <a-button
                  type="primary"
                  :disabled="fileList.length === 0"
                  :loading="uploading"
                  style="margin-top: 16px"
                  @click="handleUpload"
                >
                  {{ uploading ? "上传中" : "开始上传" }}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="itemTitle">
          <span>备注</span>
        </div>
        <div class="itemContainer">
          <a-textarea
            v-model="remarkInfo"
            :auto-size="{ maxRows: 2 }"
            style="margin-top:10px"
          />
        </div>
      </div>
      <div class="itemupload">
        <div class="splitLine"></div>
        <a-button
          type="primary"
          style="float:right;margin-right:10px;margin-top:10px"
          @click="uploadHandingOver"
        >
          提交
        </a-button>
        <!-- <a-button
        type="default"
        style="float:right;margin-right:10px;margin-top:10px"
        @click="tmpSaveProject"
      >
        暂存
      </a-button> -->
      </div>
    </a-spin>
  </div>
</template>
<script>
import ExpenseOpinionEditableTable from "./ExpenseOpinionEditableTable";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
import moment from "moment";
import request from "@/utils/request";
const groupcolumns = [
  {
    title: "资料名称",
    dataIndex: "materialName",
    width: "40%",
    scopedSlots: { customRender: "materialName" },
  },
  {
    title: "资料件数",
    dataIndex: "materialCount",
    width: "30%",
    scopedSlots: { customRender: "materialCount" },
  },
  //   {
  //     title: "操作",
  //     dataIndex: "userOperation",
  //     width: "20%",
  //     scopedSlots: { customRender: "userOperation" },
  //   },
];
export default {
  props: ["projectInfo"],
  components: { ExpenseOpinionEditableTable },
  data() {
    return {
      groupcolumns,
      groupdata: [],
      handingMaterialTableData: [],
      handingMaterialTableCount: 0,
      handingManName: "",
      officalSealChecked: false,
      priceInfoChecked: false,
      handingTimeDate: "",
      handingManPhone: "",
      isformerReturn: false,
      remarkInfo: "",
      sendTime: "",
      spinning: false,
      uploadedFileList: [],
      fileList: [],
      uploading: false,
    };
  },
  methods: {
    moment,
    async getHandingInfo() {
      this.spinning = true;
      const tmp_data = await request.get("/resulthanding/handinginfodetail", {
        params: {
          handingsn: this.projectInfo,
        },
      });
      this.handingMaterialTableData = [];
      this.handingMaterialTableCount = 0;
      const tmp_datax = tmp_data.data[0];
      console.log(tmp_datax);
      this.handingManName = tmp_datax.handingman;
      this.handingManPhone = tmp_datax.handingmanphone;
      this.handingTimeDate = tmp_datax.handingtime;
      this.officalSealChecked = tmp_datax.isSealed;
      this.priceInfoChecked = tmp_datax.isPrice;
      this.isformerReturn = tmp_datax.isReturn;
      this.remarkInfo = tmp_datax.remark;
      if (tmp_datax.handingFile !== "") {
        this.uploadedFileList = tmp_datax.handingFile.split("\/");
        this.sendTime = tmp_datax.sendTime;
      }
      const materialInfo = tmp_datax.handingmaterial.slice(
        0,
        tmp_datax.handingmaterial.length - 1
      );
      console.log(materialInfo);
      if (materialInfo) {
        let objectItem = materialInfo.split(";");
        objectItem.forEach((element) => {
          this.handingMaterialTableCount++;
          const newData = {
            key: this.handingMaterialTableCount,
            materialName: element.split(",")[0],
            materialCount: element.split(",")[1],
          };
          this.handingMaterialTableData.push(newData);
        });
      }

      this.spinning = false;
    },
    handlegroupDataGCLTableAdd() {
      const { handingMaterialTableData, handingMaterialTableCount } = this;
      const newData = {
        key: this.handingMaterialTableCount,
        materialName: "",
        materialCount: "1",
      };
      this.handingMaterialTableData = [...handingMaterialTableData, newData];
      this.handingMaterialTableCount = handingMaterialTableCount + 1;
    },
    deleteHandingOverMaterial(key) {
      const handingMaterialTableData = [...this.handingMaterialTableData];
      this.handingMaterialTableData = handingMaterialTableData.filter(
        (item) => item.key !== key
      );
    },
    onMaterialDataDataChange(key, dataIndex, value) {
      const handingMaterialTableData = [...this.handingMaterialTableData];
      const target = handingMaterialTableData.find((item) => item.key === key);
      if (target) {
        //插入数据 替换为Switch Case形式
        target[dataIndex] = value;
      }
      console.log(this.handingMaterialTableData);
    },
    handingTimeChange(date, dateString) {
      this.handingTimeDate = dateString;
    },
    onOfficakSealChange(e) {
      this.officalSealChecked = !this.officalSealChecked;
    },
    onPriceInfoChange(e) {
      this.priceInfoChecked = !this.priceInfoChecked;
    },
    onformerReturn(e) {
      this.isformerReturn = !this.isformerReturn;
    },
    uploadHandingOver() {
      if (this.handingManName == "") {
        this.$message.warning("请输入接收人姓名");
        return;
      }
      let postParams = new URLSearchParams();
      postParams.append("handingsn", this.projectInfo);
      postParams.append("handingTime", this.handingTimeDate);
      postParams.append("handingMan", this.handingManName);
      postParams.append("handingManPhone", this.handingManPhone);
      postParams.append("isSeal", this.officalSealChecked);
      postParams.append("isPrice", this.priceInfoChecked);
      postParams.append("isReturn", this.isformerReturn);
      postParams.append("Remark", this.remarkInfo);
      postParams.append(
        "SendingMan",
        JSON.parse(sessionStorage.getItem("userToken")).UserName
      );
      let materialInfoStr = "";
      this.handingMaterialTableData.forEach((e) => {
        materialInfoStr += e.materialName + "," + e.materialCount + ";";
      });
      postParams.append("handingMaterial", materialInfoStr);
      axios
        .post(GLOBAL.env + "/resulthanding/edithandingrecord", postParams)
        .then((res) => {
          if (res.data === "success") {
            if (this.fileList.length == 0) {
              let updatefile = new URLSearchParams();
              updatefile.append("handingsn", this.projectInfo);
              let existedFileStr = "";
              if (this.uploadedFileList.length != 0) {
                for (let i = 0; i < this.uploadedFileList.length; i++) {
                  existedFileStr += this.uploadedFileList[i] + "\/";
                }
                existedFileStr = existedFileStr.slice(
                  0,
                  existedFileStr.length - 1
                );
              }
              updatefile.append("existedFiles", existedFileStr);
              this.uploading = true;
              axios
                .post(
                  GLOBAL.env + "/resulthanding/updatewithoutnewhandingfile",
                  updatefile
                )
                .then((res) => {
                  if (res.data === "success") {
                    this.$message.success("修改成功");
                    this.getHandingInfo();
                    this.fileList = [];
                  } else {
                    this.$message.error("修改失败");
                  }
                  this.uploading = false;
                });
            } else {
              this.handleUpload();
              this.$message.success("修改成功");
            }
          } else {
            this.$message.error("修改失败");
          }
        });
    },
    //文件上传
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
        formData.append("myfile", file);
      });
      formData.append("handingsn", this.projectInfo);
      let existedFileStr = "";
      if (this.uploadedFileList.length != 0) {
        for (let i = 0; i < this.uploadedFileList.length; i++) {
          existedFileStr += this.uploadedFileList[i] + "\/";
        }
        existedFileStr = existedFileStr.slice(0, existedFileStr.length - 1);
      }
      formData.append("existedFiles", existedFileStr);
      this.uploading = true;
      axios
        .post(GLOBAL.env + "/resulthanding/uploadhandingfile", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            this.fileList = [];
            this.getHandingInfo();
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
    },
    deleteSelectItem(item) {
      const index = this.uploadedFileList.indexOf(item);
      const newFileList = this.uploadedFileList.slice();
      newFileList.splice(index, 1);
      this.uploadedFileList = newFileList;
    },
    async downloadFile(item) {
      const tmp_data = await request.get("/resulthanding/downloadhandingfile", {
        params: {
          postfilename: item,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/resulthanding/downloadhandingfile",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          postfilename: item,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", item);
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
      });
    },
  },
  mounted: function() {
    this.getHandingInfo();
  },
};
</script>
<style lang="scss">
.opinionContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 800px;
  overflow: auto;
  .item {
    margin-top: 10px;
    .itemTitle {
    }
    .itemContainer {
      .smallItem {
        width: 100%;
        display: grid;
        margin-top: 10px;
        grid-template-columns: 50% 50%;

        .itembox {
          padding: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border: 1px rgb(232, 232, 232) solid;
        }
      }
    }
    .uploadFileConainer {
    }
  }
  .splitLine {
    width: 100%;
    height: 1px;
    background-color: #d4d4d4;
    margin-top: 10px;
  }
}
.opinionContainer::-webkit-scrollbar-track {
}

.opinionContainer::-webkit-scrollbar {
  width: 5px;
}

.opinionContainer::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  margin-left: 20px;
  border-radius: 3px;
}
</style>
