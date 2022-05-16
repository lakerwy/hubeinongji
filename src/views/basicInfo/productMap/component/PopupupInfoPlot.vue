<template>
  <div class="right_tab_container">
    <div class="title">
      <strong>农机耕作地块信息</strong>
      <div class="close-container">
        <img
          src="@/assets/images/one-picture-close.png"
          alt=""
          @click="close"
        />
      </div>
    </div>
    <div class="content">
      <div v-for="(item, index) in infoList" class="info" :key="index">
        <div class="key-container">{{ item.name }}</div>
        <div class="value-container" :class="item.class">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMachineDetail_ } from "_api/agridata";
import { getMachineDict } from "../../../../api/basic/machine";

export default {
  props: ["data"],
  data() {
    return {
      infoList: [
        { id: 1, name: "地块ID：", value: "", class: "", field: "rowId" },
        {
          id: 2,
          name: "农机类型：",
          value: "",
          class: "",
          field: "machineType",
        },
        { id: 2, name: "作业类型：", value: "", class: "", field: "jobType" },
        {
          id: 3,
          name: "农机分组：",
          value: "",
          class: "",
          field: "groupNameFullPath",
        },
        {
          id: 4,
          name: "车牌号码：",
          value: "",
          class: "",
          field: "plateNumber",
        },
        {
          id: 5,
          name: "机手姓名：",
          value: "",
          class: "",
          field: "ownerName",
        },
        { id: 6, name: "作业地点：", value: "", class: "", field: "address" },
        {
          id: 7,
          name: "开始时间：",
          value: "",
          class: "",
          field: "jobStartTime",
        },
        {
          id: 8,
          name: "结束时间：",
          value: "",
          class: "",
          field: "jobEndTime",
        },
        {
          id: 9,
          name: "计算面积：",
          value: "",
          class: "",
          field: "computeArea",
        },
        {
          id: 10,
          name: "平均深度：",
          value: "",
          class: "",
          field: "avgDepth",
        },
        {
          id: 11,
          name: "审核状态：",
          value: "",
          class: "",
          field: "auditFlag",
        },
      ],
      machineList: [],
      jobList: [],
    };
  },
  watch: {
    data: {
      handler(newName, oldName) {
        let form1 = { listType: "machine_type" };
        let form2 = { listType: "job_type" };

        getMachineDict(form1).then((response) => {
            //console.log(this.machineList);
          if (response.code == 0 && response.data) {
            this.machineList = response.data;
          }
        });
        getMachineDict(form2).then((response) => {
          if (response.code == 0 && response.data) {
            this.jobList=response.data;
          }
        });

        // pbw修改
        let form
        if(newName.row_id){
          form = { rowId: newName.row_id };
        }
        if (!newName) return;
        getMachineDetail_(form).then((response) => {
          // debugger;
          if (response.code == 0 && response.data) {
            response.data.auditFlag == "1"
              ? (response.data.auditFlag = "通过")
              : (response.data.auditFlag = "不通过");

            this.machineList.forEach((item) => {
              if (response.data.machineType == item.itemCode) {
                response.data.machineType = item.itemName;
              }
            });
            this.jobList.forEach((item) => {
              if (response.data.jobType == item.itemCode) {
                response.data.jobType = item.itemName;
              }
            });

            this.infoList.forEach((item) => {
              item.value = response.data[item.field];
            });
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    formatValue(val, type) {
      switch (type) {
        case "job_type":
          break;
        case "job_type":
          break;
        case "job_type":
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right_tab_container {
  position: absolute;
  width: 410px;
  left: 10px;
  top: -190px;
  background-color: rgba(18, 26, 46, 0.9);
  border: 1px solid #64bfff;
  padding-bottom: 10px;

  .title {
    height: 37px;
    background-image: linear-gradient(
      to right,
      rgba(9, 100, 181, 1),
      rgba(0, 0, 0, 0)
    );
    font-size: 16px;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;

    .close-container {
      width: 30px;
      cursor: pointer;
    }
  }

  .content {
    max-height: 364px;
    overflow-y: auto;
  }

  .info {
    font-size: 16px;
    display: flex;
    margin-top: 12px;

    .key-container {
      font-size: 14px;
      color: #a3bbce;
      width: 90px;
      text-align: right;
    }

    .value-container {
      font-size: 14px;
      color: #64bfff;
      width: 300px;
    }

    .online {
      color: #0ba790;
    }
  }
}
</style>