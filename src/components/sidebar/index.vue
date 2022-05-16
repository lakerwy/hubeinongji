<template>
  <div class="avue-sidebar" v-if="!validatenull(leftmenu)">
    <el-scrollbar style="height: 100%">
      <el-menu
        style="z-index: 5"
        :default-active="nowTagValue"
        :show-timeout="200"
        :default-openeds="openeds"
        unique-opened
        mode="vertical"
      >
        <sidebar-item @initPathChange="navTagChange" :menu="leftmenu" :props="website.menu.props" first />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sidebarItem from "./sidebarItem";
import { validatenull } from "@/util/validate";

export default {
  name: "Sidebar",
  components: { sidebarItem },
  created() {
    this.openeds.push(sessionStorage.getItem("sideBarIndex") || "");
  },
  computed: {
    ...mapGetters(["website", "leftmenu"]),
  },
  data() {
    return {
      nowTagValue: "",
      openeds: ["/admin/user"],
    };
  },
  methods: {
    validatenull(menu) {
      return validatenull(menu);
    },
    navTagChange(val){
      // debugger;
      //console.log(val);
      this.nowTagValue = val;
    }
  },
};
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
