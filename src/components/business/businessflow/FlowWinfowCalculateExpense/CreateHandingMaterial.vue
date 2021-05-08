<template>
  <div class="opinionContainer">
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
            <span>交接时间</span>
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
            <a-checkbox :checked="priceInfoChecked" @change="onPriceInfoChange">
              价格信息
            </a-checkbox>
            <a-checkbox :checked="isformerReturn" @change="onformerReturn">
              原报告回收
            </a-checkbox>
          </div>
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
      <a-button
        type="default"
        style="float:right;margin-right:10px;margin-top:10px"
        @click="cancelSaveHandingOver"
      >
        取消
      </a-button>
    </div>
  </div>
</template>
<script>
import ExpenseOpinionEditableTable from "./ExpenseOpinionEditableTable";
import GLOBAL from "./../../../../utils/global_variable";
import axios from "axios";
import moment from "moment";
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
  {
    title: "操作",
    dataIndex: "userOperation",
    width: "20%",
    scopedSlots: { customRender: "userOperation" },
  },
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
      handingTimeDate: moment().format("YYYY-MM-DD"),
      handingManPhone: "",
      isformerReturn: false,
      remarkInfo: "",
    };
  },
  methods: {
    moment,
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
      postParams.append("projectsn", this.projectInfo);
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
        .post(GLOBAL.env + "/resulthanding/inserthandinginfo", postParams)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("创建成功");
            this.$emit("childFn");
          } else {
            this.$message.error("创建失败");
          }
        });
    },
    cancelSaveHandingOver() {},
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
