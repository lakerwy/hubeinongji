<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog class="menu-dialog" :title="!form.rowId ? '新增': '修改'"
             :visible.sync="visible">
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="form.menuType" size="small">
              <el-radio-button label="0">左菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
              <el-radio-button label="2">顶菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <treeselect v-model="form.menuPid"
                        :options="menuOptions"
                        :normalizer="normalizer"
                        :show-count="true"
                        placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="图标" prop="menuIco" v-if="form.menuType == 0">
        <avue-input-icon v-model="form.menuIco" :icon-list="iconList"></avue-input-icon>
      </el-form-item>
      <el-form-item label="名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item label="路由地址" prop="menuUrl" v-if="form.type !== '1'">
        <el-input v-model="form.menuUrl" placeholder="请输入路由地址"/>
      </el-form-item>
      <el-form-item label="权限标识" prop="menuPermission" v-if="form.type === '1'">
        <el-input v-model="form.menuPermission" placeholder="请权限标识" maxlength="50"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="menuSeq">
            <el-input-number v-model="form.menuSeq" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item label="路由缓冲" prop="keepAlive" v-if="form.menuType !== '1'">
            <el-radio-group v-model="form.keepAlive">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addObj, fetchMenuTree, getObj, putObj} from '@/api/admin/menu'
  import Treeselect from "@riophae/vue-treeselect"
  import iconList from '@/const/iconList'
  import TableForm from './'
  import "@riophae/vue-treeselect/dist/vue-treeselect.css"

  export default {
    name: "Menu",
    components: {Treeselect, TableForm},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 菜单树选项
        menuOptions: [],
        // 是否显示弹出层
        visible: false,
        // 图标
        iconList: iconList,
        form: {
          rowId: undefined,
          menuName: undefined,
          menuUrl: undefined,
          menuIco: undefined,
          menuPermission: undefined,
          menuType: '0',
          keepAlive: '0',
          menuPid:undefined,
          menuSeq: 999
        },
        // 表单校验
        rules: {
          menuName: [
            {required: true, message: "菜单名称不能为空", trigger: "blur"}
          ],
          menuSeq: [
            {required: true, message: "菜单顺序不能为空", trigger: "blur"}
          ],
          menuUrl: [
            {required: true, message: "路由地址不能为空", trigger: "blur"}
          ],
          keepAlive: [
            {required: true, message: "路由缓冲不能为空", trigger: "blur"}
          ],
          menuPermission: [
            {required: true, message: "权限标识不能为空", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      init(isEdit, id) {
        if (id != null) {
          this.form.menuPid = id;
        }
        this.visible = true
        this.getTreeselect();
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (isEdit) {
            getObj(id).then(response => {
              this.form = response.data
            })
          } else {
            this.form.rowId = undefined
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            debugger
            if (this.form.menuPid === undefined) {
              this.form.menuPid = 0
            }
            if (this.form.rowId) {
              putObj(this.form).then(data => {

                if(data.code===0){
                  this.$message.success('修改成功')
                  this.visible = false
                  this.$emit('refreshDataList')
                }else{
                  this.$message.success('修改失败')
                }
              });
            } else {
              addObj(this.form).then(data => {
                if(data.code===0){
                  this.$message.success('添加成功')
                  this.visible = false
                  this.$emit('refreshDataList')
                }else{
                  this.$message.success('添加失败')
                }
              })
            }
          }
        })
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        fetchMenuTree().then(response => {
          this.menuOptions = [];
          const menu = {id: 0, name: '根菜单', children: []};
          menu.children = response.data;
          this.menuOptions.push(menu);
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      }
    }
  };
</script>


<style lang="less" scoped>
.menu-dialog {
  /deep/ .el-radio-button .el-radio-button__inner {
    border-radius: 0;
    border: solid 1px #00a8ff;
    background: transparent;
    color:#009af2;
  }
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #00a8ff;
    border: solid 1px #00a8ff;
    color: #fff;
  }
}
</style>