import {validatenull} from './validate'
import service from '@/request/index.js'
import request from '@/request/index'
import * as CryptoJS from 'crypto-js'

// 表单序列化
export const serialize = data => {
    const list = []
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join('&')
}
export const getObjType = obj => {
    var toString = Object.prototype.toString
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    if (obj instanceof Element) {
        return 'element'
    }
    return map[toString.call(obj)]
}
/**
 * 对象深拷贝
 */
export const deepClone = data => {
    var type = getObjType(data)
    var obj
    if (type === 'array') {
        obj = []
    } else if (type === 'object') {
        obj = {}
    } else {
        // 不再具有下一层次
        return data
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]))
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = deepClone(data[key])
        }
    }
    return obj
}
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
    delete obj1.close
    var o1 = obj1 instanceof Object
    var o2 = obj2 instanceof Object
    if (!o1 || !o2) { /*  判断不是对象  */
        return obj1 === obj2
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
        // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];//console.log(Object.keys(arr))->0,1,2;
    }

    for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object
        var t2 = obj2[attr] instanceof Object
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr])
        } else if (obj1[attr] !== obj2[attr]) {
            return false
        }
    }
    return true
}
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
    if (status) {
        document.body.className = document.body.className + ' grayMode'
    } else {
        document.body.className = document.body.className.replace(' grayMode', '')
    }
}
/**
 * 设置主题
 */
export const setTheme = (name) => {
    document.body.className = name
}

/**
 *加密处理
 */
export const encryption = (params) => {
    let {
        data,
        type,
        param,
        key
    } = params
    const result = JSON.parse(JSON.stringify(data))
    if (type === 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele])
        })
    } else {
        param.forEach(ele => {
            var data = result[ele]
            key = CryptoJS.enc.Latin1.parse(key)
            var iv = key
            // 加密
            var encrypted = CryptoJS.AES.encrypt(
                data,
                key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.ZeroPadding
                })
            result[ele] = encrypted.toString()
        })
    }
    return result
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
        exitFullScreen()
    } else {
        reqFullScreen()
    }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
    function listen() {
        callback()
    }

    document.addEventListener('fullscreenchange', function () {
        listen()
    })
    document.addEventListener('mozfullscreenchange', function () {
        listen()
    })
    document.addEventListener('webkitfullscreenchange', function () {
        listen()
    })
    document.addEventListener('msfullscreenchange', function () {
        listen()
    })
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen()
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen()
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
    }
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen()
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen()
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen()
    }
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length !== 0) {
            for (let j = 0; j < menu[i].children.length; j++) {
                if (menu[i].children[j].id === id) {
                    return menu[i]
                } else {
                    if (menu[i].children[j].children.length !== 0) {
                        return findParent(menu[i].children[j].children, id)
                    }
                }
            }
        }
    }
}

/**
 * 动态插入css
 */

export const loadStyle = url => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
}
/**
 * 判断路由是否相等
 */
export const isObjectValueEqual = (a, b) => {
    let result = true
    Object.keys(a).forEach(ele => {
        const type = typeof (a[ele])
        if (type === 'string' && a[ele] !== b[ele]) result = false
        else if (type === 'object' && JSON.stringify(a[ele]) !== JSON.stringify(b[ele])) result = false
    })
    return result
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
    let result = ''
    if (validatenull(dic)) return value
    if (typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean') {
        let index = 0
        index = findArray(dic, value)
        if (index !== -1) {
            result = dic[index].label
        } else {
            result = value
        }
    } else if (value instanceof Array) {
        result = []
        let index = 0
        value.forEach(ele => {
            index = findArray(dic, ele)
            if (index !== -1) {
                result.push(dic[index].label)
            } else {
                result.push(value)
            }
        })
        result = result.toString()
    }
    return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
        if (dic[i].value === value) {
            return i
        }
    }
    return -1
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = ''
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
    if (date) random = random + Date.now()
    return random
}
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}

/**
 *  <img> <a> src 处理
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
export function handleImg(url, id) {
    return validatenull(url) ? null : request({
        url: url,
        method: 'get',
        responseType: 'blob'
    }).then((response) => { // 处理返回的文件流
        const blob = response.data
        const img = document.getElementById(id)
        img.src = URL.createObjectURL(blob)
        window.setTimeout(function () {
            window.URL.revokeObjectURL(blob)
        }, 0)
    })
}

export function handleDown(filename, bucket) {
    return request({
        url: '/admin/sys-file/' + bucket + '/' + filename,
        method: 'get',
        responseType: 'blob'
    }).then((response) => { // 处理返回的文件流
        const blob = response.data
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        window.setTimeout(function () {
            URL.revokeObjectURL(blob)
            document.body.removeChild(link)
        }, 0)
    })
}

export function getQueryString(url, paraName) {
    const arrObj = url.split('?')
    if (arrObj.length > 1) {
        const arrPara = arrObj[1].split('&')
        let arr
        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split('=')
            // eslint-disable-next-line eqeqeq
            if (arr != null && arr[0] == paraName) {
                return arr[1]
            }
        }
        return ''
    } else {
        return ''
    }
}

/**
 * 一般用于字典回显，已知value展示label
 * @param {*} value 需要筛选的数据值
 * @param {*} props 对象，{labelkey: '', valueKey: ''},当前数据对应的可以 value
 * @param {*} data 原始数据,数组
 */
export function filterDict(value, props = {labelKey: 'label', valueKey: 'value'}, data) {
    if (!data) return value
    let arr = data.filter(item => item[props.valueKey] == value);
    let res = arr.length > 0 ? arr[0][props.labelKey] : '无';
    return res;
}

/**
 * @param  {Array} 要转换的数据
 * @param  {String} 每个数据独有的key
 * @param  {String} 每个数据的父级id
 */
export function toTreeData(data, key = 'id', p = 'pid') {
    let result = [];
    if (!isArray(data)) {
        return result;
    }
    let map = {};
    data.forEach(i => {
        map[i[key]] = i
    })
    data.forEach(i => {
        let parent = map[i[p]];
        if (parent) {
            (parent.children || (parent.children = [])).push(i)
        } else {
            result.push(Object.assign(i, {isShowDel: false}))
        }
    })
    return result;
}

//树形数组转换成一维数组
export function tree2arr(tree) {
    let arr = []
    const expanded = datas => {
        if (datas && datas.length > 0) {
            datas.forEach(e => {
                let obj = {};
                for (let i in e) {
                    if (!(e[i] instanceof Array)) {
                        obj[i] = e[i]
                    }
                }
                arr.push(obj)
                expanded(e.children)
            })
        }
    }
    expanded(tree)
    return arr
}

//删数组中的值
export function delArrayVal(val, arr) {
    let index = arr.indexOf(val);
    arr.splice(index, 1)
    // return arr;
}

//万亩保留两位小数
export function valueTofixed(val) {
    let num;
    num = Number(val / 10000).toFixed(2);
    // num= Number(num)
    return num;
}

//获取
export function getSelectionIds(selection, rowId) {
    let ids = '';
    let length = selection.length;
    if (rowId) {
        selection.forEach((item, index) => {
            if (index == length - 1) {
                ids += item[rowId];
            } else {
                ids += item[rowId] + ',';
            }
        })
    } else {
        selection.forEach((item, index) => {
            if (index == length - 1) {
                ids += item[rowId];
            } else {
                ids += item + ',';
            }
        })
    }
    return ids;
}

//日期格式化
export function dateFormat(date, format = 'yyyy-MM-dd hh:mm:ss') {
    // let format = 'yyyy-MM-dd hh:mm:ss'
    if (date) {
        if (date instanceof Date) {
            var o = {
                'M+': date.getMonth() + 1, // month
                'd+': date.getDate(), // day
                'h+': date.getHours(), // hour
                'm+': date.getMinutes(), // minute
                's+': date.getSeconds(), // second
                'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
                'S': date.getMilliseconds() // millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length === 1 ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length))
                }
            }
            return format
        } else {
            return date || ''
        }
    }
}

//日期格式化
export function dateToYearMonthString(date, type = 'day') {
    let res = new Date(date)
    let month = res.getMonth() + 1
    let year = res.getFullYear()
    let day = res.getDate()
    month = month > 10 ? month : '0' + month;
    day = day > 10 ? day : '0' + day
    if (type == 'day') {
        return `${year}-${month}-${day}`
    } else if (type == 'month') {
        return `${year}-${month}`
    }
}

//下载文件
export function handBlobDown(url, obj, title) {
    if (!url) {
        url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
    }
    return request({
        url: url,
        method: 'post',
        responseType: 'blob',
        data: {
            filePath: obj
        },
        isForm: true,
    }).then((response) => { // 处理返回的文件流
        // const blob = new Blob([response])
        const blob = response
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = title;
        document.body.appendChild(link)
        link.click()
        link.remove();
    })
}


//下载基础信息的模板
export function handTemplateDown(url, title) {
    return request({
        url: url,
        method: 'get',
        responseType: 'blob',
        // data: data,
        // isForm: true,
    }).then((response) => { // 处理返回的文件流
        // const blob = new Blob([response])
        const blob = response
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = title;
        document.body.appendChild(link)
        link.click()
        link.remove();
    })
}

export const handTemplateDown2 = (url,toolInfoExcelPort,groupId,toolType,toolIfa,terminalCode) => {
    return service.post(`${window.globalUrl.HOME_API}agri-web/cd/tool/toolInfoExcelPort`, {url,toolInfoExcelPort,groupId,toolType,toolIfa,terminalCode})
  }

//下载文件
export const download = function (url) {
    let elA = document.createElement("a");
    elA.href = url;
    elA.download = url;
    elA.click()
}
export const Cookie_ = {
    set: function (key, val, time) {//设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        //将val加密
        var cipherVal = CryptoJS.AES.encrypt(val, "hbdx#njzz@2022").toString();
        document.cookie = key + "==" + cipherVal + ";expires=" + date.toGMTString();  //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var cookies = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = cookies.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var cipherVal;  //加密值
        var realVal;  //解密值
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("==");   //将单条cookie用"双等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  	//匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                cipherVal = arr[1];   	//将cookie的值赋给变量tips
                break;   		//终止for循环遍历
            }
        }
        if (cipherVal) {
            var bytes = CryptoJS.AES.decrypt(cipherVal, "hbdx#njzz@2022");
            realVal = bytes.toString(CryptoJS.enc.Utf8);
        }
        return realVal;
    },
    del: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
    },
    setCookie: function (username, psw, exdays) {
        // Encrypt，加密账号密码
        var cipherUserName = CryptoJS.AES.encrypt(
            username,
            "hbdx#njzz@2022"
        ).toString();
        var cipherPsw = CryptoJS.AES.encrypt(psw + '', "hbdx#njzz@2022").toString();
        console.log(cipherUserName + '/' + cipherPsw)//打印一下看看有没有加密成功

        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie，为什么这里用了==，因为加密后的字符串也有个=号，影响下面getcookie的字符串切割，你也可以使用更炫酷的符号。
        window.document.cookie =
            "username" +
            "==" +
            cipherUserName +
            ";path=/;expires=" +
            exdate.toGMTString();
        window.document.cookie =
            "password" +
            "==" +
            cipherPsw +
            ";path=/;expires=" +
            exdate.toGMTString();
    },
    //读取cookie
    getCookie: function () {
        var result = {};
        if (document.cookie.length > 0) {
            var arr = document.cookie.split("; "); //这里显示的格式请根据自己的代码更改
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split("=="); //根据==切割
                //判断查找相对应的值
                if (arr2[0] == "username") {
                    // Decrypt，将解密后的内容赋值给账号
                    var bytes = CryptoJS.AES.decrypt(arr2[1], "hbdx#njzz@2022");
                    result.username = bytes.toString(CryptoJS.enc.Utf8);
                } else if (arr2[0] == "password") {
                    // Decrypt，将解密后的内容赋值给密码
                    var bytes = CryptoJS.AES.decrypt(arr2[1], "hbdx#njzz@2022");
                    result.password = bytes.toString(CryptoJS.enc.Utf8);
                }
            }
        }
        return result;
    },
    //清除cookie
    clearCookie: function () {
        this.setCookie("", "", -1);
    }
};

export const downloadPost = function (url) {
    let form = document.createElement("form");
    document.body.appendChild(form);
    form.method = 'post'; //请求方式
    form.action = url;  // 请求（下载）路径
    form.submit();  //表单提交
    document.body.removeChild(form); // 移除创建的元素
}

export const filterForm = function (temp, obj) {
    let newObj = {};
    for (let i in temp) {
        if (obj[i] || obj[i] == 0) {
            newObj[i] = obj[i]
        } else {
            newObj[i] = temp[i]
        }
    }
    return newObj
}

// 查表得知：
// 数字0~9对应的ASCII码值是 48-57
// 大写字母A-Z对应的ASCII码值是 65-90
// 小写字母a-z对应的ASCII码值是 97-122
export function getPassword(legnth) {
    // 定义一个空数组保存我们的密码
    let passArrItem = [];
    // 定义获取密码成员的方法
    const getNumber = () => Math.floor(Math.random() * 10); // 0~9的数字
    const getUpLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65); // A-Z
    const getLowLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
    const getSpacialLetter = () => ['~', '!', '@', '#', '$', '%', '^', '&', '*'][Math.floor(Math.random() * 9)];


    // 将获取成员的方法保存在一个数组中方便用后面生成的随机index取用
    const passMethodArr = [getNumber, getUpLetter, getLowLetter];
    // 随机index
    const getIndex = () => Math.floor(Math.random() * 3);
    // 从0-9，a-z，A-Z中随机获取一项
    const getPassItem = () => passMethodArr[getIndex()]();
    // 不多解释
    Array(legnth - 4).fill('').forEach(() => {
        passArrItem.push(getPassItem());
    })
    const confirmItem = [getSpacialLetter(),getNumber(), getUpLetter(), getLowLetter()];
    // 加上我们确认的三项，从而使生成的密码，大写字母、小写字母和数字至少各包含一个
    passArrItem.push(...confirmItem);
    // 转为字符串返回
    return passArrItem.join('');
}

//判断对象是否为数组
export function isArray(value) {
    if (typeof Array.isArray === "function") {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}

//获取字典列表中itemCode对应的itemName
export function getSelectionValue(itemCode, arr) {
    let code = itemCode.split(",")
    let data = arr.filter(item => {
        return code.indexOf(item.itemCode) != -1
    }).map(item => {
        return item.itemName
    }).join(',')
    return data
}

/**
 * 获取角度
 */
export function getAngle(lng_a, lat_a, lng_b, lat_b) {
    var a = (90 - lat_b) * Math.PI / 180;
    var b = (90 - lat_a) * Math.PI / 180;
    var AOC_BOC = (lng_b - lng_a) * Math.PI / 180;
    var cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
    var sinc = Math.sqrt(1 - cosc * cosc);
    var sinA = Math.sin(a) * Math.sin(AOC_BOC) / sinc;
    var A = Math.asin(sinA) * 180 / Math.PI;
    var res = 0;
    if (lng_b > lng_a && lat_b > lat_a) res = A;
    else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
    else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
    else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
    else if (lng_b > lng_a && lat_b == lat_a) res = 90;
    else if (lng_b < lng_a && lat_b == lat_a) res = 270;
    else if (lng_b == lng_a && lat_b > lat_a) res = 0;
    else if (lng_b == lng_a && lat_b < lat_a) res = 180;

    return res;
}