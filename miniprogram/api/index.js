// var version = 'v1_1/';
var webhost = "https://develop.vsclouds.com/jielong/";
//  var webhost = 'https://jielongtest.vsclouds.com/jielong/';
var webapi = {
  // 创建接龙
  newjielong: webhost + "solitaire/create",

  // 查询单条接龙信息详情
  jielongdetail: webhost + "solitaire/info",

  // 查询单条接龙信息详情(不带参与人员信息的)
  jielongdetailbase: webhost + "solitaire/info/base",

  // 与接龙详情信息绑定的参与人员名单信息 参数： from，count，solitaireId(接龙或者信息统计ID)
  jielongstatistics : webhost + "solitaire/statistics/list",

  // 查询接龙列表 我发表的
  jielonglist: webhost + "solitaire/list",

  // 查询接龙列表 我参与的
  jielonglistcy: webhost + "solitaire/participate/list",

  // 参与接龙
  jielongcy: webhost + "solitaire/statistics/create",

  // 编辑用户参与接龙
  jielongcyedit:webhost + "solitaire/statistics/update",

  // 删除用户参与接龙
  jielongcydelete: webhost + "solitaire/statistics/delete",

  
  // 删除接龙
  jielongdelete: webhost + 'solitaire/delete',

  // 编辑接龙
  jielongupdata: webhost + 'solitaire/update',

  // 生成表格
  createexcel: webhost + 'solitaire/excel/download',

  // 表格导出
  exportexcel: webhost + 'solitaire/excel/create',

  // 成员列表加载
  memberlist: webhost + 'solitaire/member/list',
  
  // excel上传
  // 参数名：file，类型文件
  excelUpload: webhost + 'solitaire/member/excel/upload',

  // 成员删除
  memberdel: webhost + 'solitaire/member/delete', 

  // 手机登录
  phoneLogin: webhost + "public/weixin/mp/common/user/login/phone",

  // 微信登陆
  wxLogin: webhost + "public/weixin/mp/common/user/login/wx",


  // 绑定微信
  bindwx: webhost + "weixin/mp/common/user/bind",
  // banner
  banner: webhost + "public/banner/list",
  // 预定课程
  signup: webhost + "course/reserve/create",
  // 预定课程列表
  signupList: webhost + "course/reserve/list",
  // 判断是否登录
  isLogin: webhost + "weixin/mp/common/user/info"
};

// 时间
var date = new Date();

const objToStr = obj => {
  var strParmas = "";
  var firstP = 1;
  for (var p in obj) {
    var linkAdd = "";
    if (firstP == 0) {
      linkAdd = "&";
    }
    strParmas = strParmas + linkAdd + p + "=" + obj[p];
    firstP = 0;
  }
  return strParmas;
};

// 过滤安全字符
const hexiestr = (str) =>{

}

// request get 请求
const getData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      timeout:12000,
      header: {
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success (res) {
        console.log(res);
        if(res.statusCode == 200 || res.statusCode == 401){
          resolve(res.data);
        }else{
          if(res.statusCode == 404){
            wx.showToast({
              title: '访问资源错误',
              icon: 'none',
              duration: 1000
            })
          }else{
            wx.showToast({
              title: '服务器错误,请退出后重启',
              icon: 'none',
              duration: 1000
            })
          }
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/fabu/fabu',
            })
          },1000)
        }
      },
      fail (err) {
        console.log(err);
        const updateManager = wx.getUpdateManager()
        updateManager.applyUpdate();
        reject(err)
      }
    })
  })
}

// request post 请求
const postData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      timeout:12000,
      header: {
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success (res) {
        console.log(res)
        resolve(res.data);
      },
      fail (err) {
        console.log(err);
        const updateManager = wx.getUpdateManager()
        updateManager.applyUpdate();
        reject(err)
      }
    })
  })
}

const postDataWx = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      timeout: 12000,
      responseType: 'arraybuffer',
      header: {
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success(res) {
        console.log(res)
        resolve(res);
      },
      fail(err) {
        console.log(err);
        const updateManager = wx.getUpdateManager()
        updateManager.applyUpdate();
        reject(err)
      }
    })
  })
}

// loading加载提示
const showLoading = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success (res) {
        console.log('显示loading')
        resolve(res)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

// 关闭loading
const hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading()
    console.log('隐藏loading')
    resolve()
  })
}

// 接口返回结果统一前置处理
const reshook = (res,path) => {  
  if(res.resultCode == 0){
    return true
  }
  if(res.resultCode == 87014){
    wx.showToast({
      title: res.message,
      icon:"none",
      duration:1500
    })
  }
  if(res.resultCode == 4001) {
    var data = {
      url:path
    }
    var origin = encodeData(data);
    console.log('/pages/wxlogin/wxlogin?'+origin)
    wx.redirectTo({
      url: '/pages/wxlogin/wxlogin?'+origin
    })
  }
  if(res.resultCode == 4000){
    wx.showToast({
      title: '接龙已结束，提交失败！',
      duration: 2000,
      icon: 'none'
    })
  }
  if(res.resultCode == 5000) {
    wx.showToast({
      title: '服务器错误',
      icon:'none',
      duration:1200
    })
    setTimeout(()=>{
      wx.switchTab({
        url: '/pages/fabu/fabu',
      })
    },1200)
    
  }
}

const encodeData = (datadetail) =>{
  var dataparams = Object.keys(datadetail).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(datadetail[key]);
  }).join("&");
  return dataparams
}
const getDate = (endtime) =>{
  if (endtime) {
    // 编辑模式下，有传入的endtime
    var newdate = endtime.split(" ")[0];
    return newdate;
  } else {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate() + 7
    return [year, month, day].map(formatNumber).join('-')
  }
}
const getTimes = (endtime) =>{
  if(endtime){
    var newtime = endtime.split(" ")[1];
    var newtime1 = newtime.split(":")[0] + ":" + newtime.split(":")[1];
    return newtime1;
    // 编辑模式下，有传入的endtime
  }else{
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [hour, minute].map(formatNumber).join(':')
  }
  
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 字符型的true false转换布尔型
const strbool = (str) =>{
  if(str == 'true'){
    return true
  }
  if (str == 'false') {
    return false
  }
  if (str == 'undefined') {
    return true
  }
  

}

// 判断accessToken是否超时
const tokenOvertime = () =>{
  var timediff = 60 * 60 + 60 * 50; //暂定1个小时
  try {
    var accessTokenValue = wx.getStorageSync('accessToken');
    var accessTimeValue = wx.getStorageSync('accessTime');
    var timestampValue = wx.getStorageSync('timestamp');
    if (accessTokenValue && accessTimeValue && timestampValue) {
      var newtimestamp = Date.parse(new Date());
      var curtimestamp = newtimestamp / 1000;
      console.log("存储时间：" + accessTimeValue);
      console.log("存储时间戳为：" + timestampValue);
      console.log("当前时间戳为：" + curtimestamp);
      console.log('时间戳相差：' + (curtimestamp - timestampValue))
      if ((curtimestamp - timestampValue) < timediff) {
        return false
      } else {
        return true
      }
    }
  } catch (e) {
    return true
  }

}

// 获取accessToken
const getaccessToken = (accesstoken, accesstime, timestamp) => {
  wx.setStorage({
    key: "accessToken",
    data: accesstoken
  })
  wx.setStorage({
    key: "accessTime",
    data: accesstime
  })
  wx.setStorage({
    key: "timestamp",
    data: timestamp
  })  
}

/** 
 * new Date() ---> 转化为 年 月 日 时 分 秒
 * let date = new Date();
 * date: 传入参数日期 Date
*/
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


module.exports = {
  webapi,
  getData,
  postData,
  showLoading,
  hideLoading,
  reshook,
  getDate,
  getTimes,
  strbool,
  postDataWx,
  getaccessToken,
  tokenOvertime
};
