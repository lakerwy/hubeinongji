<template>
  <div>
    <el-tabs v-model.trim="activeTab" editable @edit="handleTabsEdit" class="tabs" @tab-click="handleClick">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in form.tools"
        :label="item.title"
        :name="item.name"
      >
        <el-form ref="form" :rules="rules" :model="item" label-width="150px" :inline="true">
          <el-form-item label="机具名称:">
            <el-input v-model.trim="item.toolName" maxlength="20" placeholder="请输入机具名称"></el-input>
          </el-form-item>
          <el-form-item label="机具类型:" prop="toolType">
            <el-select v-model.trim="item.toolType" placeholder="请选择机具类型">
              <el-option v-for="i in machineDict.toolTypeSelect" :key="i.id" :label="i.itemName" :value="i.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机具识别码:" prop="toolIfa">
            <el-input v-model.trim="item.toolIfa" maxlength="16" placeholder="请输入机具识别码" ></el-input>
          </el-form-item>
          <el-form-item label="机具高度(厘米):" prop="toolHeight">
            <el-input v-model.trim="item.toolHeight" maxlength="10" placeholder="请输入机具高度"></el-input>
          </el-form-item>
          <el-form-item label="机具宽度(米):" prop="toolWidth">
            <el-input v-model.trim="item.toolWidth" maxlength="10" placeholder="请输入机具宽度"></el-input>
          </el-form-item>
          <el-form-item label="机具备注:">
            <el-input v-model.trim="item.remark" maxlength="40" placeholder="请输入机具备注"></el-input>
          </el-form-item>
        </el-form>  
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const tempForm = {
  toolIfa: '',
  toolName: '',
  toolHeight: '',
  toolWidth: '',
  toolType: '',
  remark: '',
}

export default {
  props: ['form','machineDict'],
  data() {
    let theRules2 = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (value) {
          if (value < 0 || value > 20) {
            callback(new Error("区间为(0,20]"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      rules: {
        toolType: [
          {required: true, message: '请选择机具类型', trigger: 'change'},
        ],
        toolIfa: [
          {required: true, message: '请输入机具识别码', trigger: 'blur'},
        ],
        toolHeight: [
          {required: true, message: '请输入机具高度', trigger: 'blur'},
          { validator: theRules2, trigger: "blur" },

        ],
        toolWidth: [
          {required: true, message: '请输入机具宽度', trigger: 'blur'},
          { validator: theRules2, trigger: "blur" },
        ]
      },
      activeTab: '1',
      tabIndex: 0,
    }
  },
  computed: {

  },
  methods: {
    //编辑tabs 新增和删除
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        // this.$emit('addToolTabs')
        this.addTabs();
      }
      if (action === 'remove') {
        this.$confirm('是否确定删除选择的数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.removeTabs(targetName);
        }).catch(() => {
          /*this.$message({
            type: 'info',
            message: '已取消删除'
          });*/
        });
      }
    },
    //新增tabs
    addTabs(){
      let newTabName = ++this.tabIndex + '';
      let obj = Object.assign({
        title: '机具信息'+newTabName,
        name: newTabName,
      },tempForm)
      this.form.tools.push(obj);
      this.activeTab = newTabName;
    },
    //删除tabs
    removeTabs(targetName){
      --this.tabIndex
      let tabs = this.form.tools;
      let activeName = this.activeTab;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            } else {
              activeName = '机具信息1';
            }
          }
        });
      }
      this.activeTab = activeName;
      this.form.tools = tabs.filter(tab => tab.name !== targetName);
    },
    handleClick(tab, event){

    }
  }
}
</script>

<style scoped lang="less">
.tabs {
  margin-bottom: 20px;
}
/deep/ .el-tabs__header {
  margin-left: 50px;
  margin-right: 40px;
  border-bottom: 1px solid #55adff;
}
/deep/ .el-tabs__item {
  padding: 0 10px;
}

/deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
/deep/ .el-tabs__active-bar {
  height: 0;
}
/deep/ .el-tabs__item{
  color: #fefefe;
}
/deep/ .is-active {
  background-image: url("../../../../../assets/images/tab-background.png");
  background-size: 100% 100%;
}
</style>