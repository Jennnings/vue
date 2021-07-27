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
              style="width: 150px"
              placeholder="选择项目类型"
              @change="selectprojectType(record.key, $event)"
              v-if="projectType"
              v-model="record.type"
            >
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="(e) => e.preventDefault()"
                  @click="addCustomerProjecttItem"
                >
                  <a-icon type="plus" />
                  自定义项目
                </div>
              </div>
              <a-select-option v-for="item in projectType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="projectUnit" slot-scope="text, record">
            <a-select
              style="width: 200px"
              placeholder="选择项目单位"
              @change="selectUnitType(record.key, $event)"
              v-if="unitType"
              v-model="record.unit"
            >
              <a-select-option v-for="item in unitType" :key="item.indexs">
                {{ item.value }}
              </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="(e) => e.preventDefault()"
                  @click="addCustomerUnitItem"
                >
                  <a-icon type="plus" />
                  自定义项目
                </div>
              </div>
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
        <div class="smallItems">
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
          <div class="itembox">
            <a-button
              type="primary"
              style="margin-left:10px"
              @click="downLoadJKD"
            >
              缴款单下载
            </a-button>
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
        <div class="smallItems">
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
        v-if="!fromComprehensiveInquery"
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
    <a-modal
      v-model="addProjectModalVisible"
      title="添加自定义工作内容"
      @ok="handleOk"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <a-input v-model="projectTypeCustomer"> </a-input>
    </a-modal>
    <a-modal
      v-model="addUnitModalVisible"
      title="添加自定义单位信息"
      @ok="handleUnitOk"
      :destroyOnClose="distoryThis"
      :maskClosable="false"
    >
      <a-input v-model="unitTypeCustomer"> </a-input>
    </a-modal>
  </div>
</template>
<script>
import request from "@/utils/request";
import projectdata from "../../../../assets/menulist/project-type.json";
import unitdata from "../../../../assets/menulist/project-unit.json";
import ExpenseOpinionEditableTable from "./ExpenseOpinionEditableTable";
import axios from "axios";
import GLOBAL from "./../../../../utils/global_variable";
import moment from "moment";
const groupcolumns = [
  {
    title: "工作内容",
    dataIndex: "projectType",
    width: "15%",
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
    scopedSlots: { customRender: "projectUnit" },
  },
  {
    title: "单价",
    width: "15%",
    dataIndex: "perPrice",
    scopedSlots: { customRender: "perPrice" },
  },
  {
    title: "总价",
    width: "10%",
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
const unitData = unitdata;
const projectData = projectdata;
export default {
  props: ["projectInfo", "fromComprehensiveInquery"],
  components: {
    ExpenseOpinionEditableTable,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      groupcolumns,
      groupdata: "",
      groupdatagcl: "",
      groupDataGCLTable: [],
      groupDataGCLTableCount: 0,
      projectType: projectData.data,
      unitType: unitData.data,
      isRemainChecked: false,
      fileList: [],
      uploading: false,
      expenseOpinionStr: "",
      totalPrice: 0,
      getCost: 0,
      addProjectModalVisible: false,
      distoryThis: true,
      projectTypeCustomer: "",
      addUnitModalVisible: false,
      unitTypeCustomer: "",
      uploadedFileList: [],
    };
  },
  methods: {
    moment,
    async getGroupGZL() {
      const tmp_data = await request.get("/calculateexpense/getProjectGZL", {
        params: {
          projectsn: this.projectInfo,
        },
      });
      this.groupDataGCLTable = [];
      this.groupDataGCLTableCount = 0;
      this.groupdata = tmp_data.data[0].gznr + "\n" + tmp_data.data[0].gcl;
      if (tmp_data.data[0].getcost !== "null") {
        this.getCost = tmp_data.data[0].getcost;
      }
      if (tmp_data.data[0].totalPrice !== "null") {
        this.totalPrice = tmp_data.data[0].totalcost;
      }
      this.expenseOpinionStr = tmp_data.data[0].sfOpinion;
      if (this.expenseOpinionStr === "null") {
        this.expenseOpinionStr = "";
      }
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
            [i].replace(/[^0-9.]/gi, "");
          newData.unit = tmp_data.data[0].gcl
            .split(";")
            [i].replace(/[0-9.]/g, "");
          this.groupDataGCLTable.push(newData);
          this.groupDataGCLTableCount++;
        }
      } else {
        let remarkStr = tmp_data.data[0].priceRemark;
        remarkStr = remarkStr.slice(0, remarkStr.length - 1);
        let sfInfoStr = tmp_data.data[0].sfOtherInfo;
        sfInfoStr = sfInfoStr.slice(0, sfInfoStr.length - 1);
        for (let i = 0; i < remarkStr.split(";").length; i++) {
          let tmpdata = remarkStr.split(";")[i].split(",");
          let otherInfoStr = sfInfoStr.split(";")[i];
          let newData = {
            key: this.groupDataGCLTableCount,
            type: tmpdata[4],
            gztype: "",
            gcl: tmpdata[0],
            unit: tmpdata[1],
            perPrice: tmpdata[2],
            totalPrice: tmpdata[3],
            otherInfo: otherInfoStr,
          };
          this.groupDataGCLTable.push(newData);
          this.groupDataGCLTableCount++;
        }
      }
      if (tmp_data.data[0].filelist && tmp_data.data[0].filelist != "No") {
        this.uploadedFileList = tmp_data.data[0].filelist.split("/");
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
      const chgclAddGroup = [...this.groupDataGCLTable];
      // console.log(groupDataGCLTable);
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      const tmp_projecttype = [...this.projectType];
      if (target) {
        const selectedvalue = tmp_projecttype.find(
          (item) => item.indexs == value
        );
        console.log(selectedvalue);
        target.type = selectedvalue.value;
        this.groupDataGCLTable = chgclAddGroup;
      }
      // this.postParams.append(this.chgclAddGroup);
    },
    selectUnitType(key, value) {
      console.log(value);
      const chgclAddGroup = [...this.groupDataGCLTable];
      // this.postParams.append(key, value, chgclAddGroup);
      const target = chgclAddGroup.find((item) => item.key === key);
      if (target) {
        const selectedvalue = this.unitType.find(
          (item) => item.indexs == value
        );
        console.log(target);
        target.unit = selectedvalue.value;
        this.groupDataGCLTable = chgclAddGroup;
      }
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
        formData.append("myfile", file);
      });
      formData.append("projectsn", this.projectInfo);
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
        .post(GLOBAL.env_file + "/calculateexpense/jkdfileupload", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$message.success("上传成功");
            this.getGroupGZL();
            this.fileList = [];
          } else {
            this.$message.error("上传失败");
          }
          this.uploading = false;
        });
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
    uploadProject() {
      console.log("tmpsaveProject");
      let remarkStr = "";
      let isRemainCost;
      let infoStr = "";
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
          infoStr += tmpdata.otherInfo + ";";
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
      postParams.append("sfOtherInfo", infoStr);
      axios
        .post(GLOBAL.env + "/calculateexpense/uploadproject", postParams)
        .then((res) => {
          console.log(res);
          //this.$emit("updateSuccess");
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",收费->归档,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.expenseOpinionStr;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                // if (res.data === "success") {
                //   this.$message.success("提交成功");
                //   this.$emit("updateSuccess");
                // }
                if (res.data === "success") {
                  if (this.fileList.length == 0) {
                    let updatefile = new URLSearchParams();
                    updatefile.append("projectsn", this.projectInfo);
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
                        GLOBAL.env + "/calculateexpense/withoutnewjkdfile",
                        updatefile
                      )
                      .then((res) => {
                        if (res.data === "success") {
                          this.$message.success("提交成功");
                          this.fileList = [];
                          this.$emit("updateSuccess");
                        } else {
                          this.$message.error("提交失败");
                        }
                        this.uploading = false;
                      });
                  } else {
                    this.handleUpload();
                    this.$emit("updateSuccess");
                  }
                }
              });
          } else {
            this.$message.error("提交失败");
          }
        });
    },
    tmpSaveProject() {
      console.log("tmpsaveProject", this.groupDataGCLTable);
      let remarkStr = "";
      let infoStr = "";
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
          infoStr += tmpdata.otherInfo + ";";
        }
      }
      if (this.isRemainChecked) {
        isRemainCost = 1;
      } else {
        isRemainCost = 0;
      }
      console.log(infoStr);
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
      postParams.append("sfOtherInfo", infoStr);
      axios
        .post(GLOBAL.env + "/calculateexpense/remainproject", postParams)
        .then((res) => {
          //console.log(res);
          //this.$emit("updateSuccess");
          let tmp_result = res.data[0];
          let time_str = moment().format("YYYY/MM/DD HH:mm:ss");
          if (tmp_result.result == "success") {
            let clgc_str =
              tmp_result.datas +
              "\\n#" +
              time_str +
              ",收费暂存,处理人:" +
              JSON.parse(sessionStorage.getItem("userToken")).UserName +
              ",意见:" +
              this.expenseOpinionStr;
            let clgcPostParams = new URLSearchParams();
            clgcPostParams.append("clgc", clgc_str);
            clgcPostParams.append("projectsn", this.projectInfo);
            axios
              .post(GLOBAL.env + "/common/updateclgc", clgcPostParams)
              .then((res) => {
                if (res.data === "success") {
                  if (this.fileList.length == 0) {
                    let updatefile = new URLSearchParams();
                    updatefile.append("projectsn", this.projectInfo);
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
                        GLOBAL.env + "/calculateexpense/withoutnewjkdfile",
                        updatefile
                      )
                      .then((res) => {
                        if (res.data === "success") {
                          this.$message.success("暂存成功");
                          this.groupDataGCLTable = [];
                          this.getGroupGZL();
                          this.fileList = [];
                        } else {
                          this.$message.error("暂存失败");
                        }
                        this.uploading = false;
                      });
                  } else {
                    this.handleUpload();
                  }
                }
              });
          } else {
            this.$message.error("暂存失败");
          }
        });
    },
    addCustomerProjecttItem() {
      this.addProjectModalVisible = true;
    },
    addCustomerUnitItem() {
      this.addUnitModalVisible = true;
    },
    handleOk() {
      if (!this.projectTypeCustomer) {
        this.addProjectModalVisible = false;
        return;
      }
      this.addProjectModalVisible = false;
      const initDataLength = this.projectType.length + 1;
      let tmp_obj = {
        index: initDataLength,
        indexs: initDataLength.toString(),
        key: initDataLength.toString(),
        value: this.projectTypeCustomer,
      };
      this.projectType.push(tmp_obj);
      this.projectTypeCustomer = "";
      console.log(initDataLength);
    },
    handleUnitOk() {
      if (!this.unitTypeCustomer) {
        this.addUnitModalVisible = false;
        return;
      }
      this.addUnitModalVisible = false;
      const initDataLength = this.unitType.length + 1;
      let tmp_obj = {
        index: initDataLength,
        indexs: initDataLength.toString(),
        key: initDataLength.toString(),
        value: this.unitTypeCustomer,
      };
      this.unitType.push(tmp_obj);
      this.unitTypeCustomer = "";
    },
    async downloadFile(item) {
      const tmp_data = await request.get("/common/downloadfile", {
        params: {
          postfilename: item,
        },
      });
      if (tmp_data.data === "error") {
        this.$message.error("文件不存在");
        return;
      }
      axios({
        url: GLOBAL.env + "/common/downloadfile",
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
    deleteSelectItem(item) {
      const index = this.uploadedFileList.indexOf(item);
      const newFileList = this.uploadedFileList.slice();
      newFileList.splice(index, 1);
      this.uploadedFileList = newFileList;
    },
    async downLoadJKD() {
      axios({
        url: GLOBAL.env + "/relatedfiles/" + "jkd",
        method: "GET",
        header: {
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
        },
        responseType: "blob",
        params: {
          projectsn: this.projectInfo,
          userid: JSON.parse(sessionStorage.getItem("userToken")).UserID,
        },
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "JKD" + ".xlsx");
        document.body.append(fileLink);
        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
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
      .smallItems {
        width: 100%;
        display: grid;
        grid-template-columns: 45% 25% 25%;
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
