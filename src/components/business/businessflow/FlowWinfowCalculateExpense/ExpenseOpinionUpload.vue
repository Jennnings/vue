<template>
  <div class="opinionContainer">
    <div class="item">
      <div class="itemTitle">
        <span>小组填报</span>
      </div>
      <div class="itemContainer">
        <a-textarea
          v-model="groupdata"
          placeholder="小组填报工程量"
          :disabled="true"
          :auto-size="{ maxRows: 3 }"
          style="margin-top:10px"
        />
      </div>
    </div>
    <div class="item">
      <div class="itemTitle">
        <span>
          核算收费
        </span>
        <a-button
          class="editable-add-btn"
          @click="handlegroupDataGCLTableAdd"
          size="small"
          style="margin-left:10px"
        >
          添 加
        </a-button>
      </div>
      <div class="itemContainer">
        <a-table
          :columns="groupcolumns"
          :data-source="groupDataGCLTable"
          style="margin-top:10px"
          bordered
        >
          <template slot="projectType" slot-scope="text, record">
            <a-select
              style="width: 100px"
              placeholder="选择项目类型"
              @change="selectprojectType(record.key, $event)"
              v-if="projectType"
              :default-value="record.type"
            >
              <a-select-option v-for="item in projectType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="userOperation" slot-scope="text, record">
            <a-popconfirm
              v-if="groupDataGCLTable.length"
              title="是否确认删除?"
              @confirm="() => onDeleteDataGCL(record.key)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
          <template slot="gcl" slot-scope="text, record">
            <ExpenseOpinionEditableTable
              :text="text"
              @change="onGZLDataChange(record.key, 'gcl', $event)"
            />
          </template>
          <template slot="gztype" slot-scope="text, record">
            <ExpenseOpinionEditableTable
              :text="text"
              @change="onGZLDataChange(record.key, 'gztype', $event)"
            />
          </template>
          <template slot="perPrice" slot-scope="text, record">
            <ExpenseOpinionEditableTable
              :text="text"
              @change="onGZLDataChange(record.key, 'perPrice', $event)"
            />
          </template>
          <!-- <template slot="totalPrice" slot-scope="text, record">
            <ExpenseOpinionEditableTable
              :text="text"
              @change="onGZLDataChange(record.key, 'totalPrice', $event)"
            />
          </template> -->
          <template slot="otherInfo" slot-scope="text, record">
            <ExpenseOpinionEditableTable
              :text="text"
              @change="onGZLDataChange(record.key, 'otherInfo', $event)"
            />
          </template>
        </a-table>
      </div>
    </div>
    <div class="item">
      <div class="itemTitle">
        总收费
      </div>
      <div class="itemContainer">
        <div class="smallItem">
          <div class="itembox">
            <span>应收(元)</span>
            <a-input
              style="width:240px;margin-left:10px"
              v-model="totalPrice"
            ></a-input>
            <a-button
              type="primary"
              style="margin-left:10px"
              @click="totalPriceCount"
            >
              计算总价
            </a-button>
            <a-checkbox
              @change="onIsRemainChange"
              :checked="isRemainChecked"
              style="margin-left:20px"
            >
              已开单
            </a-checkbox>
          </div>
          <div class="itembox">
            <span>实收(元)</span>
            <a-input
              style="width:240px;margin-left:10px"
              v-model="getCost"
            ></a-input>
          </div>
        </div>
      </div>
    </div>
    <div class="item" style="margin-top:10px">
      <div class="splitLine"></div>
      <div
        class="itemContainer"
        style="display:flex;flex-direction:row;align-items: center;width:100%"
      >
        <div class="smallItem">
          <div>
            <span>客户评价</span>
            <a-rate :default-value="2.5" allow-half style="margin-left:10px" />
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="itemTitle">
        <span>
          缴款单上传
        </span>
      </div>
      <div class="itemContainer">
        <div class="smallItem">
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
    <div class="item">
      <div class="itemTitle">
        <span>收费意见</span>
      </div>
      <div class="itemContainer">
        <a-textarea
          v-model="expenseOpinionStr"
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
        @click="uploadProject"
      >
        提交
      </a-button>
      <a-button
        type="default"
        style="float:right;margin-right:10px;margin-top:10px"
        @click="tmpSaveProject"
      >
        暂存
      </a-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import projectdata from "../../../../assets/menulist/project-type.json";
import ExpenseOpinionEditableTable from "./ExpenseOpinionEditableTable";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
const groupcolumns = [
  {
    title: "工作内容",
    dataIndex: "projectType",
    width: "10%",
    scopedSlots: { customRender: "projectType" },
  },
  {
    title: "工作类型",
    dataIndex: "gztype",
    width: "10%",
    scopedSlots: { customRender: "gztype" },
  },
  {
    title: "工作量",
    dataIndex: "gcl",
    width: "10%",
    scopedSlots: { customRender: "gcl" },
  },
  {
    title: "单位",
    width: "10%",
    dataIndex: "unit",
  },
  {
    title: "单价",
    width: "15%",
    dataIndex: "perPrice",
    scopedSlots: { customRender: "perPrice" },
  },
  {
    title: "总价",
    width: "15%",
    dataIndex: "totalPrice",
    scopedSlots: { customRender: "totalPrice" },
  },
  {
    title: "备注",
    width: "20%",
    dataIndex: "otherInfo",
    scopedSlots: { customRender: "otherInfo" },
  },
  {
    title: "操作",
    dataIndex: "userOperation",
    width: "10%",
    scopedSlots: { customRender: "userOperation" },
  },
];
const projectData = projectdata;
export default {
  props: ["projectInfo"],
  components: {
    ExpenseOpinionEditableTable,
  },
  data() {
    return {
      groupcolumns,
      groupdata: "",
      groupdatagcl: "",
      groupDataGCLTable: [],
      groupDataGCLTableCount: 0,
      projectType: projectData.data,
      isRemainChecked: false,
      fileList: [],
      uploading: false,
      expenseOpinionStr: "",
      totalPrice: 0,
      getCost: 0,
    };
  },
  methods: {
    async getGroupGZL() {
      const tmp_data = await request.get("/calculateexpense/getProjectGZL", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      this.groupdata = tmp_data.data[0].gznr + "\n" + tmp_data.data[0].gcl;
      this.getCost = tmp_data.data[0].getcost;
      this.totalPrice = tmp_data.data[0].totalcost;
      this.expenseOpinionStr = tmp_data.data[0].sfOpinion;
      if (tmp_data.data[0].isremain) {
        this.isRemainChecked = true;
      } else {
        this.isRemainChecked = false;
      }
      if (!tmp_data.data[0].priceRemark) {
        for (let i = 0; i < tmp_data.data[0].gznr.split(",").length; i++) {
          let newData = {
            key: this.groupDataGCLTableCount,
            type: "",
            gztype: "",
            gcl: "",
            unit: "",
            perPrice: "",
            totalPrice: "",
            otherInfo: "",
          };
          newData.type = tmp_data.data[0].gznr.split(",")[i];
          newData.gcl = tmp_data.data[0].gcl
            .split(";")
            [i].replace(/[^0-9]/gi, "");
          newData.unit = tmp_data.data[0].gcl
            .split(";")
            [i].replace(/[0-9]/g, "");
          this.groupDataGCLTable.push(newData);
          this.groupDataGCLTableCount++;
        }
      } else {
        let remarkStr = tmp_data.data[0].priceRemark;
        remarkStr = remarkStr.slice(0, remarkStr.length - 1);
        for (let i = 0; i < remarkStr.split(";").length; i++) {
          let tmpdata = remarkStr.split(";")[i].split(",");
          let newData = {
            key: this.groupDataGCLTableCount,
            type: tmpdata[4],
            gztype: "",
            gcl: tmpdata[0],
            unit: tmpdata[1],
            perPrice: tmpdata[2],
            totalPrice: tmpdata[3],
            otherInfo: "",
          };
          this.groupDataGCLTable.push(newData);
          this.groupDataGCLTableCount++;
        }
      }
    },
    onDeleteDataGCL(key) {
      const groupDataGCLTable = [...this.groupDataGCLTable];
      this.groupDataGCLTable = groupDataGCLTable.filter(
        (item) => item.key !== key
      );
    },
    handlegroupDataGCLTableAdd() {
      const { groupDataGCLTable, groupDataGCLTableCount } = this;
      const newData = {
        key: this.groupDataGCLTableCount,
        type: "",
        gztype: "",
        gcl: "",
        unit: "",
        perPrice: "",
        totalPrice: "",
        otherInfo: "",
      };
      this.groupDataGCLTable = [...groupDataGCLTable, newData];
      this.groupDataGCLTableCount = groupDataGCLTableCount + 1;
    },
    //选择项目/工作类型
    selectprojectType(key, value) {
      const groupDataGCLTable = [...this.groupDataGCLTable];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = groupDataGCLTable.find((item) => item.key === key);
      if (target) {
        switch (value) {
          case "1":
            target.type = "面积预测";
            target.unit = "平方米";
            break;
          case "2":
            target.type = "面积实测";
            target.unit = "平方米";
            break;
          case "3":
            target.type = "人防预测";
            target.unit = "平方米";
            break;
          case "4":
            target.type = "人防实测";
            target.unit = "栋";
            break;
          case "5":
            target.type = "施工放样";
            target.unit = "栋";
            break;
          case "6":
            target.type = "竣工测量";
            target.unit = "栋";
            break;
          case "7":
            target.type = "控制测量";
            target.unit = "个";
            break;
          case "8":
            target.type = "日照测量";
            target.unit = "栋";
            break;
          case "9":
            target.type = "管线测量";
            target.unit = "公里";
            break;
          case "10":
            target.type = "土方测量";
            target.unit = "平方米";
            break;
          case "11":
            target.type = "断面测量";
            target.unit = "公里";
            break;
          case "12":
            target.type = "地形测量";
            target.unit = "平方米";
            break;
          case "13":
            target.type = "变形测量";
            target.unit = "点";
            break;
          case "14":
            target.type = "宗地调查";
            target.unit = "平方米";
            break;
          case "15":
            target.type = "其他测量";
            target.unit = "棵";
            break;
          case "16":
            target.type = "分户调查";
            target.unit = "户";
            break;
          case "17":
            target.type = "土地分割";
            target.unit = "平方米";
            break;
        }
        this.groupDataGCLTable = groupDataGCLTable;
      }
      // this.postParams.append(this.chgclAddGroup);
    },
    onGZLDataChange(key, dataIndex, value) {
      const groupDataGCLTable = [...this.groupDataGCLTable];
      const target = groupDataGCLTable.find((item) => item.key === key);
      if (target) {
        //插入数据 替换为Switch Case形式
        target[dataIndex] = value;

        if (dataIndex == "perPrice") {
          if (target.gcl) {
            target.totalPrice = (
              Number(target.perPrice) * Number(target.gcl)
            ).toFixed(2);
          }
        }
        if (dataIndex == "gcl") {
          if (target.perPrice) {
            target.totalPrice = Number(target.perPrice) * Number(target.gcl);
          }
        }
        if (dataIndex == "totalPrice") {
          if (target.perPrice && target.gcl == "") {
            target.gcl = (
              Number(target.totalPrice) / Number(target.perPrice)
            ).toString;
          }
        }
        if (dataIndex == "totalPrice") {
          if (target.gcl && target.perPrice == "") {
            target.perPrice = (
              Number(target.totalPrice) / Number(target.gcl)
            ).toString();
          }
        }
        //this.groupDataGCLTable = groupDataGCLTable;
      }
      console.log(this.groupDataGCLTable);
    },
    //是否已开单
    onIsRemainChange(item) {
      this.isRemainChecked = !this.isRemainChecked;
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
        formData.append("files[]", file);
      });
      this.uploading = true;
    },
    totalPriceCount() {
      if (this.groupDataGCLTable.length === 0) {
        this.$message.warning("请填入工作量并计算单项总价");
        return;
      }
      this.totalPrice = 0;
      for (let i = 0; i < this.groupDataGCLTable.length; i++) {
        if (this.groupDataGCLTable[i].totalPrice) {
          this.totalPrice += Number(this.groupDataGCLTable[i].totalPrice);
        } else {
          this.totalPrice += 0;
        }
      }
      this.totalPrice = this.totalPrice.toFixed(2);
    },
    uploadProject() {},
    tmpSaveProject() {
      console.log("tmpsaveProject");
      let remarkStr = "";
      let isRemainCost;
      // let postGetCost = this.getCost;
      // let postTotalPrice = this.totalPrice;
      if (this.groupDataGCLTable.length) {
        for (let i = 0; i < this.groupDataGCLTable.length; i++) {
          let tmpdata = this.groupDataGCLTable[i];
          let perPrice = tmpdata.perPrice;
          let totalPrice = tmpdata.totalPrice;
          if (!perPrice) {
            perPrice = 0;
          }
          if (!totalPrice) {
            totalPrice = 0;
          }
          remarkStr +=
            tmpdata.gcl +
            "," +
            tmpdata.unit +
            "," +
            perPrice +
            "," +
            totalPrice +
            "," +
            tmpdata.type +
            ";";
        }
      }
      if (this.isRemainChecked) {
        isRemainCost = 1;
      } else {
        isRemainCost = 0;
      }
      console.log(remarkStr);
      let postParams = new URLSearchParams();
      postParams.append(
        "sfmanuserid",
        JSON.parse(sessionStorage.getItem("userToken")).UserID
      );
      postParams.append("projectsn", this.projectInfo);
      postParams.append("sfrequest", remarkStr);
      postParams.append("totalcost", this.totalPrice);
      postParams.append("getcost", this.getCost);
      postParams.append("isremain", isRemainCost);
      postParams.append("sfOpinion", this.expenseOpinionStr);
      axios
        .post(GLOBAL.env + "/calculateexpense/remainproject", postParams)
        .then((res) => {
          console.log(res);
          if (res.data == "success") {
            this.$message.success("项目暂存成功");
            this.$emit("updateSuccess");
          }
        });
    },
  },
  created: function() {
    this.getGroupGZL();
  },
};
</script>
<style lang="scss">
.opinionContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow: auto;
  .item {
    margin-top: 10px;
    .itemTitle {
    }
    .itemContainer {
      .smallItem {
        width: 100%;
        display: grid;
        grid-template-columns: 45% 45%;
        .itembox {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
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
