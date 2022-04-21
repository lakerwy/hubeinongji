/**
 * @desc  [自定义校验规则]
 * @example
 *  import { rule } from "@/util/rule";
 *  rules: [
 *     { validator: rule.emailValue, trigger: 'blur'}
 *  ]
 *
 *  可参考: https://gitee.com/log4j/codes/lgfxz09bmt7ea3rdwnocs20
 */

export const rule = {
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  validatorNameCn(rule, value, callback) {
    let acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入中文、英文、数字包括下划线'))
    } else {
      callback()
    }
  },
  /**
   * 校验 请输入英文、数字包括下划线
   * 名称校验
   */
  validatorName(rule, value, callback) {
    let acount = /^[A-Z_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入大写英文、下划线'))
    } else {
      callback()
    }
  },
  /* 是否手机号码或者固话*/
  isPhoneTwo(rule, value, callback) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码或者固话号码'));
      } else {
        callback();
      }
    }
  },
  /*是否是经度范围*/
  isLon(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else if (!Number(value)) {
      callback(new Error('请输入[-180,180]之间的数字'));
    } else if (value < -180 || value > 180) {
      callback(new Error('请输入[-180,180]之间的数字'));
    } else {
      callback();
    }
  },
  isLat(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else if (!Number(value)) {
      callback(new Error('请输入[-90,90]之间的数字'));
    } else if (value < -90 || value > 90) {
      callback(new Error('请输入[-90,90]之间的数字'));
    } else {
      callback();
    }
  }


  // 校验规则根据不同业务需求，不断拓展补充 ...
}