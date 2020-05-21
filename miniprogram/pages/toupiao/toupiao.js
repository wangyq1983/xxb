// pages/table/table.js
var app = getApp();
const api = app.globalData.api;
var allPath;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    type: 3,
    optionType:"",
    id: '',
    btnTxt: '发布投票',
    array: ['单选', '多选'],
    arrtype: ['radio', 'checkbox'],
    index: 0,
    isfillin: false,
    selectShow: true,
    selectOption: [
      '', ''
    ],
    selectIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    editable: false, //编辑选项
    idx: '',
    itemParams: {},
    toupiaoOption:[],
    filelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: api.getDate(),
      time: api.getTimes()
    })
    wx.setStorage({
      key: "shared",
      data: "0"
    })
    console.log(this.data.paramsList);
    if (options.id) {
      this.setData({
        id: options.id
      })
      var params = {
        id: options.id
      }
      allPath = this.route + '?id='+options.id;
      this.inittoupiao(allPath,params)
    }
    if (options.type == 'edit') {
      this.setData({
        btnTxt: '编辑投票'
      })
    }
  },
  async inittoupiao(allpath,params){
    await api.showLoading() // 显示loading
    var toupiaodetail = await api.getData(api.webapi.jielongdetail,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(toupiaodetail,allpath)){
      this.setData({
        title: toupiaodetail.data.title,
        content: toupiaodetail.data.content,
        filelist: toupiaodetail.data.filelist?toupiaodetail.data.filelist:[],
        optionType:toupiaodetail.data.config.key3.optionType,
        selectOption: toupiaodetail.data.config.key3.options,
        date: api.getDate(toupiaodetail.data.endDate),
        time: api.getTimes(toupiaodetail.data.endDate)
      })
      if (toupiaodetail.data.config.key3.optionType == 'radio'){
        this.setData({
          index: 0
        })
      }
      if (toupiaodetail.data.config.key3.optionType == 'checkbox'){
        this.setData({
          index: 1
        })
      }
    }
  },
  async creatToupiao(apiurl,params){
    await api.showLoading() // 显示loading
    var creatres = await api.postData(apiurl,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(creatres,this.route)){
      this.jielongSuccess(creatres)
    }
    
  },
  creatJieLong: function (e) {

    // 校验options是否有空选项
    function checkOption(opt){
      for(var i = 0; i<opt.length;i++){
        if(opt[i] == '' || opt[i].value == ''){
          return true;
        }
      }
      return false
    };
    var addfile = this.selectComponent("#imgupbox").data.imgUrl
    if (this.data.btnTxt == '发布投票') {
      
      if (e.detail.value.title == '' || checkOption(this.data.selectOption)) {
        wx.showToast({
          title: '必填项不可为空',
          icon:'none',
          duration: 2000
        })
      } else {
        var that = this;
        console.log(this.data.arrtype[this.data.index])
        this.setData({
          toupiaoOption:[
            {
              optiontitle: "选项标题",
              optionType: this.data.arrtype[this.data.index],
              percentage: "",
              select: true,
              options: this.data.selectOption
              }
          ]
        });
        var param = {
          title: e.detail.value.title,
          content: e.detail.value.content,
          filelist:addfile,
          type: 3,
          config: {
            key3: {
              description: "投票选举",
              optionType: this.data.arrtype[this.data.index],
              options: this.data.selectOption
            }
          },
          endDate: that.data.date + ' ' + that.data.time + ':30'
        }
        this.creatToupiao(api.webapi.newjielong,param);
      }
    }
    if (this.data.btnTxt == '编辑投票') {
      if (e.detail.value.title == '') {
        wx.showToast({
          title: '必填项不可为空',
          duration: 2000
        })
      } else {
        var that = this;
        var param = {
          id: this.data.id,
          title: e.detail.value.title,
          content: e.detail.value.content,
          filelist:addfile,
          type: 3,
          config: {
            key3: {
              description: "投票",
              optionType: this.data.arrtype[this.data.index],
              options: this.data.selectOption
            }
          },
          endDate: that.data.date + ' ' + that.data.time + ':30'
        }
        this.creatToupiao(api.webapi.jielongupdata,param);
      }
    }
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  jielongSuccess: function (res) {
    // 等待后端返回接口传递 id及title 供 分享使用
    wx.navigateTo({
      url: '/pages/sharejl/sharejl?id=' + res.data.id + '&title=' + res.data.title + '&type=' + res.data.type,
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  i_name: function (res) {
    // 选项输入内容触发
    // 选项序号
    console.log(res.currentTarget.id.split('_')[1]);
    var idx = res.currentTarget.id.split('_')[1];
    console.log(res.detail.value)
    var tempoption = this.data.selectOption;
    var newdata = {
      title: res.detail.value,
      value: res.detail.value,
      checked: false,
      count: 0
    }
    tempoption.splice(idx, 1, newdata);
  },
  addoption: function (e) {
    console.log(e);
    var newadd = ['']
    this.setData({
      selectOption: this.data.selectOption.concat(newadd)
    })
  },
  jianevent:function(e){
    if (this.data.selectOption.length > 2){
      var idx = e.currentTarget.dataset.idx;
      var tempselece = this.data.selectOption;
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除此项吗？',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            tempselece.splice(idx, 1)
            that.setData({
              selectOption: tempselece
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.paramsList)
    wx.getStorage({
      key: 'shared',
      success(res) {
        console.log(res.data);
        if (res.data == 1) {
          wx.reLaunch({
            url: '/pages/jllistcj/jllistcj'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  enterAdd: function (e) {
    console.log(e)
    var params = JSON.stringify(e.currentTarget.dataset.con);
    var idx = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/toupiaoadd/toupiaoadd?index=' + idx + '&params=' + params,
    })
  },
  addEvent: function () {
    wx.navigateTo({
      url: '/pages/toupiaoadd/toupiaoadd',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '学小帮',
      path: 'pages/fabu/fabu',
      success : (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  }
})