const getters = {
  userInfo: state => state.user.userInfo,
  access_token: state => state.user.access_token,
  refresh_token: state => state.user.refresh_token,
  expires_in: state => state.user.expires_in,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menu: state => state.user.menu,
  leftmenu: state => state.user.leftmenu,
  menuAll: state => state.user.menuAll,
  website: state => state.user.website,
  globalSetting: state => state.settings.globalSetting,
  isShowGroupBox: state => state.settings.isShowGroupBox,
  isShowCheckBox: state => state.settings.isShowCheckBox,
  groupTreeType:state => state.settings.groupTreeType,
  //新的
  groupTreeIsArea:state => state.settings.groupTreeIsArea,
  groupTreeIsAll:state => state.settings.isAll,
  groupData: state => state.settings.groupData,
  forcePassWordModify: state => state.user.forcePassWordModify,
}
export default getters
