var webhost = "https://develop.vsclouds.com/jielong/";
//var webhost = 'http://47.98.146.115/jielong/';
var webapi = {
  // 创建接龙
  newjielong: webhost + "solitaire/create",

  // 查询单条接龙信息详情
  jielongdetail: webhost + "solitaire/info",

  // 查询接龙列表 我发表的
  jielonglist: webhost + "solitaire/list",

  // 查询接龙列表 我参与的
  jielonglistcy: webhost + "solitaire/participate/list",

  // 参与接龙
  jielongcy: webhost + "solitaire/statistics/create",

  // 编辑用户参与接龙
  jielongcyedit:webhost + "solitaire/statistics/update",

  // 删除接龙
  jielongdelete: webhost + 'solitaire/delete',

  // 编辑接龙
  jielongupdata: webhost + 'solitaire/update',

  // 生成表格
  createexcel: webhost + 'solitaire/excel/download',

  // 表格导出
  exportexcel: webhost + 'solitaire/excel/create',

  // 学校列表
  schoolList: webhost + "public/school/get/list",
  
  // 学校详情
  schoolDetail: webhost + "public/school/detail/info/school_id",

  // 学员列表
  studentList: webhost + "public/course/student/list",
  // 学员详情
  studentDetail: webhost + "public/course/student/detail",

  // 推荐列表
  recoList: webhost + "public/course/recommend/detail/list",
  // 推荐详情
  recoDetail: webhost + "public/course/recommend/detail/info",

  // 教师列表
  teacherList: webhost + "public/course/teacher/list",
  // 教师详情
  teacherDetail: webhost + "public/course/teacher/detail",

  // 课程列表
  lessonList: webhost + "public/course/list",
  // 课程详情
  lessonDetail: webhost + "public/course/info/detail",

  // 课程类型列表
  lessonType: webhost + "public/course/type/list",

  // 手机登录
  phoneLogin: webhost + "public/weixin/mp/common/user/login/phone",

  // 微信登陆
  wxLogin: webhost + "public/weixin/mp/common/user/login/wx",

  // 收藏
  collection: webhost + "course/user/collection",

  // 收藏列表
  collectionList: webhost + "course/user/collection/list",

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

/**
 * 重新封装的ajax请求方法
 * @param {请求地址} url
 * @param {请求参数} params
 * @param {回调函数} callback
 * @param {动作类型} types
 */

const doRequest = (url, params, callback, types) => {
  console.log(url);
  console.log(params);
  console.log(callback);

  let allParams = "?" + objToStr(params); //组合为完成请求参数
  var url = url + allParams;
  console.log(url);
  wx.showLoading({
    title: "加载中"
  });
  wx.request({
    url: url,
    data: {},
    header: {
      "content-type": "application/json",
      token: wx.getStorageSync("token")
    },
    success: res => {
      console.log(res.data);
      wx.hideLoading();
      callback(res);
    },
    fail: res => {
      console.log(res);
    }
  });
};

// POST请求封装
const doRequestP = (url, params, callback, types) => {
  console.log(url);
  console.log(params);
  console.log(callback);

  console.log(url);

  wx.showLoading({
    title: "加载中"
  });
  wx.request({
    url: url,
    data: params,
    method: "POST",
    header: {
      // 'content-type': 'application/x-www-form-urlencoded' // 默认值
      "content-type": "application/json",
      token: wx.getStorageSync("token")
    },
    success: res => {
      console.log(res.data);
      wx.hideLoading();
      callback(res);
    },
    fail: res => {
      console.log(res);
      wx.hideLoading();
    }
  });
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
      header: {
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success (res) {
        console.log(res)
        resolve(res.data)
      },
      fail (err) {
        console.log(err)
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
      header: {
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success (res) {
        console.log(res)
        resolve(res.data)
      },
      fail (err) {
        console.log(err)
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


module.exports = {
  doRequest,
  doRequestP,
  webapi,
  getData,
  postData,
  showLoading,
  hideLoading
};
