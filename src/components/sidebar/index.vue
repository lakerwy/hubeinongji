<template>
  <div class="avue-sidebar">
    <el-scrollbar style="height:100%">
      <div
        v-if="validatenull(leftmenu)"
        class="avue-sidebar--tip">没有发现菜单</div>
      <el-menu
        style="z-index: 5;"
        :default-active="nowTagValue"
        :show-timeout="200"
        :default-openeds="openeds"
        unique-opened
        mode="vertical">
        <sidebar-item
          :menu="leftmenu"
          :props="website.menu.props"
          first/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarItem from './sidebarItem'
import { validatenull } from '@/util/validate'
export default {
  name: 'Sidebar',
  components: { sidebarItem },
  created() {

  },
  computed: {
    ...mapGetters(['website', 'leftmenu']),
  },
  data() {
    return {
      nowTagValue: '',
      openeds: ['/user']
    }
  },
  methods: {
    validatenull(menu) {
      return validatenull(menu)
    }
  }
}
</script>

<style lang="less">
.avue-sidebar {
  .el-menu {
    border-right: none;
    background: transparent;
    color: #fff;
  }
}
</style>
