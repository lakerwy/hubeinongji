<template>
  <div class="image-header">
    <div class="image-header-con">
      <div class="system-title header-title">
        <img src="img/logo.png" alt="" class="logo">
        <span>湖北省北斗农机信息化智能管理系统</span>
      </div>
      <div class="navigators">
        <div 
          class="nav-item" 
          v-for="(item, index) in navlists" 
          :class="{active: currentIndex == index}" 
          :key="item.label"
          @click="changeNav(item, index)">
          <span>{{item.label}}</span>
        </div>
      </div>
      <div class="admin">
        <span class="system" @click="openSetting">
          <img class="icon" src="img/icon-system.png" alt="">
          <span>设置</span>
        </span>
        <el-dropdown @command="handleCommand">
          <div class="user">
  <!--          <div class="avatar">-->
  <!--            <img src="img/logo.png" alt="">-->
  <!--          </div>-->
            <img class="icon" src="img/icon_avatar.png" alt="">
            <span>{{username}} <i class="el-icon-arrow-down el-icon--right"></i></span>
          </div>
          <el-dropdown-menu class="dropdown">
            <el-dropdown-item command="edit" class="dropdown-item"><img style="vertical-align: sub;margin-right:7px;" src="img/icon_修改2.png" alt="">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" class="dropdown-item"><img style="vertical-align: sub;margin-right:7px;" src="img/icon-logout.png" alt="">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <span class="line"></span>
        <div class="exit" @click="logout">
          <img class="icon" src="img/icon-logout.png" alt="">
          <span>退出</span>
        </div> -->
      </div>
    </div>

    <editPwd ref="pwd" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import editPwd from './editPwd'
export default {
  name: 'Header',
  components: {
    editPwd
  },
  data() {
    return {
      navlists: [
        { label: '农机大数据', icon: 'img/icons/data-icon.png', path: '/agri-data' },
        { label: '农机监控', icon: 'img/icons/exemple-icon.png', path: '/agri-monitoring' },
        { label: '作业管理', icon: 'img/icons/model-icon.png', path: '/working-management' },
        { label: '农机调度', icon: 'img/icons/log-icon.png', path: '/agri-dispatch' },
        { label: '报表分析', icon: 'img/icons/data-icon.png', path: '/report-analysis', hasChildern: true, children:[
          {
            path: '/agriMachineTerminalReport',
            name: 'agriMachineTerminalReport',
            label: '数据分析报表',
            icon: 'img/report-analysis-icon1.png',
            children:[
              {
                path: '/taskCompletionReport',
                name: 'taskCompletionReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/taskCompletionReport/index'),
                label: '任务完成情况汇总报表'
            },{
                path: '/regionalDataReport',
                name: 'regionalDataReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/regionalDataReport/index'),
                label: '区域大数据报表'
            },{
                path: '/jobDayQueryReport',
                name: 'jobDayQueryReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/jobDayQueryReport/index'),
                label: '作业日查询报表'
            },{
                path: '/agriMonthOnlineReport',
                name: 'agriMonthOnlineReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/agriMonthOnlineReport/index'),
                label: '农机月上线统计报表'
            },{
                path: '/DetectionAreaReport',
                name: 'DetectionAreaReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/DetectionAreaReport/index'),
                label: '监测面积统计报表'
            },{
                path: '/agriMachineTerminalReport',
                name: 'agriMachineTerminalReport',
                component: () => import('@/views/report-analysis/dataAnalysisReport/agriMachineTerminalReport/index'),
                label: '农机终端面积统计报表'
            },
           ]
          },          
          {
            path: '/dataAnalysisReport',
            name: 'dataAnalysisReport',
            label: '信息查询报表',
            icon: 'img/report-analysis-icon2.png',
            children:[
              {
                path: '/serviceExpReport',
                name: 'serviceExpReport',
                component: () => import('@/views/admin/user/index'),
                label: '服务到期报表'
            },{
                path: '/userLoginStatusReport',
                name: 'userLoginStatusReport',
                component: () => import('@/views/admin/user/index'),
                label: '用户登录情况报表'
            },{
                path: '/operationLogReport',
                name: 'operationLogReport',
                component: () => import('@/views/admin/user/index'),
                label: '操作日志报表'
            },
           ]
          },          
          {
            path: '/repeatWorkAlarm',
            name: 'repeatWorkAlarm',
            label: '农机统计报警报表',
            icon: 'img/report-analysis-icon3.png',
            children:[
              {
                path: '/repeatWorkAlarm',
                name: 'repeatWorkAlarm',
                component: () => import('@/views/admin/user/index'),
                label: '重复作业告警报表'
            },{
                path: '/boundaryAlarm',
                name: 'boundaryAlarm',
                component: () => import('@/views/admin/user/index'),
                label: '边界告警'
            },
           ]
          },          
          {
            path: '/workSummaryReport',
            name: 'workSummaryReport',
            label: '作业报表',
            icon: 'img/report-analysis-icon4.png',
            children:[
              {
                path: '/workSummaryReport',
                name: 'workSummaryReport',
                component: () => import('@/views/admin/user/index'),
                label: '作业汇总报表'
            },{
                path: '/agriWorkDetailReport',
                name: 'agriWorkDetailReport',
                component: () => import('@/views/admin/user/index'),
                label: '农机作业明细报表'
            },{
                path: '/agriWorkTypeReport',
                name: 'agriWorkTypeReport',
                component: () => import('@/views/admin/user/index'),
                label: '农机作业类型统计报表'
            },{
                path: '/cooperatWorkSumReport',
                name: 'cooperatWorkSumReport',
                component: () => import('@/views/admin/user/index'),
                label: '合作社作业总报表'
            },{
                path: '/cooperatAgriReport',
                name: 'cooperatAgriReport',
                component: () => import('@/views/admin/user/index'),
                label: '合作社农机作业报表'
            }
           ]
          },          
          {
            path: '/subsidyDetailReport',
            name: 'subsidyDetailReport',
            label: '补助报表',
            icon: 'img/report-analysis-icon5.png',
            children:[
              {
                path: '/subsidyDetailReport',
                name: 'subsidyDetailReport',
                component: () => import('@/views/admin/user/index'),
                label: '补助资金明细报表'
            },{
                path: '/subsidySummaryReport',
                name: 'subsidySummaryReport',
                component: () => import('@/views/admin/user/index'),
                label: '补助情况汇总报表'
            },{
                path: '/workSubsidySumReport',
                name: 'workSubsidySumReport',
                component: () => import('@/views/admin/user/index'),
                label: '作业补贴汇总报表'
            },
           ]
          },
        ]
        },
        { label: '基础信息', icon: 'img/icons/data-icon.png', path: '/basicInfo' },
        { label: '系统管理', icon: 'img/icons/data-icon.png', path: '/admin', hasChildern: true, children: [
          {
            path: '/user',
            name: 'user',
            label: '权限管理',
            icon: 'img/icon-权限管理.png',
            children: [
              {
                path: '/user',
                name: 'user',
                component: () => import('@/views/admin/user/index'),
                label: '用户管理'
              },
              {
                path: '/role',
                name: 'role',
                component: () => import('@/views/admin/role/index'),
                label: '角色管理'
              },
              {
                path: '/dept',
                name: 'dept',
                component: () => import('@/views/admin/dept/index'),
                label: '分组管理'
              },
              {
                path: '/menu',
                name: 'menu',
                component: () => import('@/views/admin/menu/index'),
                label: '菜单管理'
              },
            ]
          },
          {
            path: '/opreationSeason',
            name: 'opreationSeason',
            label: '平台配置',
            icon: 'img/icon-平台配置.png',
            hasChildern: true,
            children:[
              {
                path: '/opreationSeason',
                name: 'opreationSeason',
                component: () => import('@/views/admin/platform/opreationSeason/index'),
                label: '作业季管理'
              },{
                path: '/task',
                name: 'task',
                component: () => import('@/views/admin/platform/task/index'),
                label: '任务管理'
              },{
                path: '/audit',
                name: 'audit',
                component: () => import('@/views/admin/platform/audit/index'),
                label: '审核标准'
              },{
                path: '/algorithm',
                name: 'algorithm',
                component: () => import('@/views/admin/platform/algorithm/index'),
                label: '算法配置'
              },{
                path: '/agreement',
                name: 'agreement',
                component: () => import('@/views/admin/platform/agreement/index'),
                label: '通信协议管理'
              },
            ]
          },
          {
            path: '/dict',
            name: 'dict',
            label: '系统设置',
            icon: 'img/icon-系统设置.png',
            hasChildern: true,
            children: [
              {
                path: '/dict',
                name: 'dict',
                component: () => import('@/views/admin/dict/index'),
                label: '字典管理'
              },{
                path: '/setMachineWorking',
                name: 'setMachineWorking',
                component: () => import('@/views/admin/setMachineWorking/index'),
                label: '农机机具作业配置'
              },{
                path:'/about',
                name:'about',
                component: () => import('@/views/admin/about/index'),
                label: '关于我们'
              }
            ]
          },
          {
            path: '/operadata',
            name: 'operadata',
            label: '运维资料管理',
            icon: 'img/icon_运维资料管理.png',
          }
        ] 
        },
      ],
      currentIndex: sessionStorage.getItem('navIndex') ? sessionStorage.getItem('navIndex') : 0,
      username: sessionStorage.getItem('username') ? sessionStorage.getItem('username') : '管理员',
      items: []
    }
  },
  created() {
    // this.getTopMenu();
    console.log(sessionStorage.getItem('navIndex'))
  },
  methods: {
    ...mapMutations({
      SET_MENU_LEFT: 'SET_MENU_LEFT'
    }),
    getTopMenu() {
      this.$store.dispatch("GetTopMenu").then(res => {
          this.navlists = res;
      });
    },
    changeNav(item, index) {
      // 切换模块 item当前模块的数据 index当前模块的序号
      this.currentIndex = index;
      sessionStorage.setItem('navIndex', this.currentIndex)
      if(item.hasChildern) {
        // 请求二级菜单
        // this.$store.dispatch('GetLeftMenu', {})
        this.SET_MENU_LEFT({type:true, menu: item.children})
      } 
        console.log(item.path)
        this.$router.push({path: item.path})
    },
    openSetting() {
      this.$emit('setting', true)
    },
    // 用户操作
    handleCommand(command) {
      if(command == 'edit') {
        this.$refs.pwd.dialogVisible = true;
      } else if(command == 'logout') {
        this.logout();
      }
    },
    async logout() {
      // 退出登录
      this.$store.dispatch("LogOut").then(res => {
        let { code, msg } = res;
        if(code == '0') {
          this.$notify.success({
            title: '提示',
            message: '退出成功！'
          })
          sessionStorage.clear();
          this.$router.push({name: 'login'})
        } else {
          this.$notify.error({
            title: '错误',
            message: msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
@Font-size: 14 / @vw;
@white: #fff;
.image-header {
  padding: 15px 0 0 0;
  // width: 100%;
  background: linear-gradient(to right,#0f1c40 20%,#0d2a54 52%, #0f1c40);
  height: 64px;
  line-height: 64px;
  &-con {
    height: 100%;
    background-image: url('../../assets/images/header-bg-line.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // border-style: solid;
    // border-width: 2px;
    // border-image-source: linear-gradient(-90deg, 
    // 	#2c4aa0 0%, 
    // 	#2178a2 50%, 
    // 	#87ffff 100%);
    // border-image-slice: 1;
    justify-content: space-between;
    align-items: center;
    display: flex;
  }

  .system-title {
    align-self: flex-start;
    font-family: SourceHanSansCN-Bold;
    font-size: 28px;
    line-height: 38px;
    margin-left: 18px;
    font-weight: bold;
    color: @white;
    background-image: -webkit-linear-gradient(270deg, #009bfe 0%, #5cc6fa 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    .logo {
      vertical-align: middle;
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }

  .navigators {
    align-self: flex-end;
    display: flex;
    flex-direction: row;
    .nav-item {
      color: #fff;
      width: 154px;
      height: 42px;
      line-height: 40px;
      background-image: url('../../assets/images/header-tab.png');
      background-repeat: no-repeat;
      background-size: contain;
      cursor: pointer;
      text-align: center;
      margin-right: -17px;
      span {
        // color: #c7e3ff;
        opacity: 1;
        font-size: 16px;
        white-space: nowrap;
      }
    }
    .nav-item:hover {
      background-image: url('../../assets/images/header-tab-active.png');
    }
    .active {
      background-image: url('../../assets/images/header-tab-active.png');
    }

  }

  .admin {
    height: 40px;
    margin-top: 5px;
    padding-right: 53px;
    display: flex;
    justify-content: space-around;
    // align-items: center;
    align-self: center;
    color: #acd3f3;
    .system {
      cursor: pointer;
    }
    .user {
      display: flex;
      align-items: center;
      margin-left: 22px;
      color: #acd3f3;
      .avatar {
        width: 39px;
        height: 39px;
        background-color: #2f5e8a;
        border-radius: 50%;
        margin-right: 8px;
        img {
          height: 100%;
          width: auto;
        }
      }
    }
    .line {
      display: inline-block;
      width: 1px;
      height: 16px;
      background-color: #ffffff;
      opacity: 0.2;
      margin: 0 10px;
    }
    .exit {
      margin-right: 20px;
      cursor: pointer;
    }
    .icon {
      vertical-align: sub;
      margin-right: 6px;
    }
  }
}
</style>

<style lang="less">
@media screen and (max-width: 1800px) {
  .header-title {
    font-size: 24px !important;
  }
}
</style>