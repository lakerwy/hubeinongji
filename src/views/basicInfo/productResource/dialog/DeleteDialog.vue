<template>
 <div>
    <el-dialog
    class="dialog"
    title="导入文件"
    :visible.sync="dialogVisible"
    width="30%"
    top="30vh"
  >
    <div class="content">
        <div :v-if = "select">
          请选择需要删除的资源信息!
        </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>确定</el-button>
    </div>
  </el-dialog>
 </div>
</template>

<script>

export default {
    data(){
        return{
            select:true,
            dialogVisible:false
        }
    }
}
</script>

<style scoped lang="less">
.content{
  padding-top: 35px;
  padding-left: 15px;
  font-size: 16px;
  color:#aac2d6
}
</style>