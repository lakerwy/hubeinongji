<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in menu">
      <el-menu-item
        v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
        :index="item[pathKey]"
        :key="item[labelKey]"
        :class="{ 'is-active': vaildAvtive(item) }"
        @click="open(item, index)"
      >
        <template slot="title">
          <img style="margin-right: 18px" :src="item[iconKey]" alt="" />
          <span>{{ item[labelKey] }}</span>
        </template>
      </el-menu-item>
      <el-submenu
        v-else-if="!validatenull(item[childrenKey]) && vaildRoles(item)"
        :index="item[labelKey]"
        :key="item[labelKey]"
      >
        <!-- <el-submenu
                    v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                    :index="item[pathKey]"
                    :key="item[labelKey]"> -->
        <template slot="title">
          <img style="margin-right: 18px" :src="item[iconKey]" alt="" />
          <span>{{ item[labelKey] }}</span>
        </template>
        <template v-for="(child, cindex) in item[childrenKey]">
          <el-menu-item
            v-if="validatenull(child[childrenKey])"
            :index="child[pathKey]"
            :class="{ 'is-active': vaildAvtive(child) }"
            :key="child[labelKey]"
            @click="open(child, cindex)"
          >
            <span slot="title">{{ child[labelKey] }}</span>
          </el-menu-item>
          <sidebar-item
            v-else
            :menu="[child]"
            :key="cindex"
            :props="props"
            :screen="screen"
            :collapse="collapse"
          />
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";

export default {
  inject: ["Index"],

  name: "SidebarItem",
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  data() {
    return {
      config: config,
      initPath: "",
    };
  },
  created() {
    this.initAvtive();
    //console.log(this.pathKey);
  },
  mounted() {},
  computed: {
    ...mapGetters(["roles"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {
    initAvtive() {
      //console.log("initAvtive进来了");
      let val = this.$router.$avueRouter.getValue(this.$route);
      let initPath;
      //console.log("this.menu", this.menu);
      if (sessionStorage.getItem("sideBarIndex")) {
        //如果当前路由和上一次点击的路由一致，直接返回，可能做了刷新操作
        /* if (sessionStorage.getItem('sideBarIndex') === val) {
                         return;
                     }*/
        if (sessionStorage.getItem("sideBarIndex")) {
          this.$router.push({ path: sessionStorage.getItem("sideBarIndex") });
          return;
        }
        //Todo:可以查询是否在当前（子）菜单中存在，做记忆功能，这里先直接返回第一个子菜单
      }
      if (this.menu[0].children && this.menu[0].children.length > 0) {
        initPath = this.menu[0].children[0].path;
      } else {
        initPath = this.menu[0].path;
      }
      //console.log("initPath", initPath);
      this.initPath = initPath;
      if (initPath) {
        this.$router.push({ path: initPath });
      }
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item, index) {
      sessionStorage.setItem("sideBarIndex", item.path);
      this.Index.openSetting(false);

      this.$router.push({ path: item.path });
    },
  },
  watch: {
    menu(newVal, oldVal) {
      this.initAvtive();
    },
    initPath(newVal, oldVal) {
      this.$emit("initPathChange", newVal);
    },
  },
};
</script>

<style lang="less">
.menu-wrapper {
  padding-top: 21px;

  .el-menu-item,
  .el-submenu__title {
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    margin-bottom: 5px;
    padding-left: 37px !important;
  }

  .el-submenu__title {
    // margin-top: 21px;
    color: #67c8ff;
  }

  .el-submenu .el-menu-item {
    padding-left: 70px !important;
  }

  .el-menu {
    background-color: #fff;
  }

  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0;
    color: #fff;
    background: linear-gradient(to right, #24446c, rgba(0, 0, 0, 0));
  }

  .el-submenu__title:hover {
    background: linear-gradient(to right, #24446c, rgba(0, 0, 0, 0));
  }

  .el-menu-item.is-active {
    // color: #fff;
    // background-color: #00a0e9;
    background: linear-gradient(to right, #24446c, rgba(0, 0, 0, 0));
  }

  .el-submenu__title i {
    color: #fff;
    font-size: 16px;
  }

  .el-submenu__icon-arrow {
    top: 45%;
  }

  .photo {
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }
}
</style>