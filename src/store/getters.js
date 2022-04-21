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
  settings: state => state.settings.settings,
  isShowGroupBox: state => state.settings.isShowGroupBox,
  isShowCheckBox: state => state.settings.isShowCheckBox,
  groupData: state => state.settings.groupData,
}
export default getters
