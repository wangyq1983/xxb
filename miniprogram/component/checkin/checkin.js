var app = getApp();
const api = app.globalData.api;
var that;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    type: {
      type: 'number',
      value: 0,
    },
    cid: {
      type: 'string',
      observer: function (newVal, oldVal) {
        this.updatcid()		//这里通过this.updatesize()方法来更新数据,来解决异步传值问题
      }
    },
    count: {
      type: 'string',
      observer: function (newVal, oldVal) {
        this.updatecount()		//这里通过this.updatesize()方法来更新数据,来解决异步传值问题
      }
    },
    showCheck: {
      type: 'Boolean',
      value: false
    }
  },
  data:{
    type:'',
    cid:'',
    count:'',
    showCheck:false,
    memberList:[],
    jielongList:[],
    nosubcon:"",
    nosubshow:false
  },
  ready(){
    this.setData({
      cid: this.properties.cid,
      type: this.properties.type,
      count: this.properties.count,
      showCheck: false
    });
  },
  methods:{
    updatcid:function(){
      this.setData({
        cid: this.properties.cid
      });
    },
    updatecount:function(){
      this.setData({
        count: this.properties.count
      });
    },
    closeEvent:function(){
      this.setData({
        nosubshow:false
      })
    },
    // 获取接龙参与者名单
    async getjielonglist(id,type,count){
      if(type == 1){
        var params = {
          id: id
        };
        var jllist = await api.getData(api.webapi.jielongdetail, params);
        console.log(jllist);
        var jielongList = jllist.data.statisticsList;
        var jielongArr = jielongList.map(x => (x.value.key1.name ? x.value.key1.name:x.nickName));
        return jielongArr;
      }
      if(type == 2){
        var param = {
          id:id
        }
        var jldetail = await api.getData(api.webapi.jielongdetailbase, param);
        console.log(jldetail);
        var jlcount = jldetail.data.total;
        var params = {
          solitaireId: id,
          order: 'desc',
          from: 1,
          count: jlcount
        };
        var jllist = await api.getData(api.webapi.jielongstatistics, params);
        console.log(jllist);
        var jielongList = jllist.data;
        // var jielongArray = jielongList.map(function(x){
        //   x.value.key2.itemList.map(y => y.value)
        // })
        var jielongArray = [];
        for(var i = 0, len = jielongList.length; i<len; i++){
          let itemarr = jielongList[i].value.key2.itemList
          for (var j = 0, len1 = itemarr.length; j < len1; j++){
            jielongArray.push(itemarr[j].value)
          }
        }
        return jielongArray;
      }
    },
    // 获取名册列表名单
    async getmemberlist(){
      var memberlist = await api.getData(api.webapi.memberlist);
      // 名单格式处理
      var memArray = [];
      var memList = memberlist.data;
      for(var i = 0,len = memList.length; i < len; i++){
        memArray.push(memList[i].memberName);
      }
      return memArray
    },
    // 复制粘贴
    copyEvent:function(){
      var that = this;
      wx.setClipboardData({
        data: that.data.nosubcon,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data) // data
              wx.showToast({
                title: '复制成功',
                icon:'none',
                duration:1500
              })
            }
          })
        }
      })
    },
    // 检查未交名单
    async checklist(){
      await api.showLoading() // 显示loading
      // 接龙参与者名单
      var jlres = await this.getjielonglist(this.data.cid, this.data.type, this.data.count);
      // 名册列表名单
      var memres = await this.getmemberlist();
      await api.hideLoading() // 等待请求数据成功后，隐藏loading
      console.log(jlres);
      console.log(memres);
      if(jlres.length > 0){
        if (memres.length > 0) {
          var nosublist = []
          for (var i = 0, len = memres.length; i < len; i++) {
            for (var j = 0, len1 = jlres.length; j < len1; j++) {
              if (memres[i] == jlres[j]) {
                break;
              } else {
                if (j == len1 - 1) {
                  nosublist.push(memres[i])
                }
              }
            }
            // memres[i]
          }
          console.log(nosublist);
          console.log(nosublist.join(','));
          if (nosublist.length == 0) {
            // 没有未提交人员,所有人都交了
            wx.showToast({
              title: '所有人都提交了',
              icon: 'none',
              duration: 3000
            })
          } else {
            // 有未交人员
            this.setData({
              nosubshow: true,
              nosubcon: nosublist.join(',')
            })

          }
        } else {
          wx.navigateTo({
            url: '/pages/roster/roster',
          })
        }   
      }else{
        wx.showToast({
          title: '现在还未有人提交',
          icon:'none',
          duration:2000
        })
      }
      
      
    }
  }
})