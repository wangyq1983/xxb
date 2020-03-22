// component/signup/signup.js
const util = require('../../utils/tools.js');

var that = this;
//console.log(that);
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    courseId: {
      type: 'number',
      value: ""
    }
  },
  data: {
    courseId: '',
    isSignup: false,
    signup_name: "",
    signup_age: "",
    signup_phone: ""
    
  },
  ready() {
    console.log(this.properties);
    this.setData({
      courseId: this.properties.courseId
    })
  },
  methods: {
   
    signupEvent: function () {
      //点击预约报名
      this.setData({
        isSignup: true
      })
    },
    closeEvent: function () {
      this.setData({
        isSignup: false
      })
    },
    yyevent: function (e) {
      console.log(e)
      that = this;
      this.setData({
        signup_name: e.detail.value.signup_name,
        signup_age: e.detail.value.signup_age,
        signup_phone: e.detail.value.signup_phone
      })
      const value = wx.getStorageSync('fromid') ? wx.getStorageSync('fromid'):""
      var param = {
        courseId:this.data.courseId,
        name: this.data.signup_name,
        age: this.data.signup_age,
        phone: this.data.signup_phone,
        sharePhone:value
      }
      console.log(param);

     util.doRequestP(util.webapi.signup, param, this.signupSuccess);
    },
    signupSuccess: function (res) {
      console.log(this)
      console.log(that)
      console.log(res)
      that.setData({
        isSignup: false
      })
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      })

    },
    
  }
})

