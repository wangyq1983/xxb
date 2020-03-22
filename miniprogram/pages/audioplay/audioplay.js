const myAudio = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play:true,
    fid:'',
    title:'',
    duration:'',
    currentTime:'',
    sliderValue:'',
    isMoveSlider:false,
    resetAudio:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fid:options.fid,
      title:options.title
    })
    myAudio.src = this.data.fid;
    myAudio.title = this.data.title;
    this.audio_play();
  },
  radomNumber:function(){

  },
  touchstart:function(){
    this.setData({
      isMoveSlider:true
    })
  },
  touchend:function(){
    this.setData({
      isMoveSlider:false
    })
  },
  format: function(t) {
    //   时间格式化
    let sec = ((t % 60) / 100).toFixed(2).slice(-2);
    let time = Math.floor(t / 60) > 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60);
    if(sec>59){
        time = (Number(time) +1)>10 ? (Number(time) +1): '0'+(Number(time) +1)
        sec = '00' ;
    }
    t = time + ':' + sec;
    return t
  },
  audio_play:function(){
    var that = this;
    if(this.data.is_play == true){
        // if(this.data.resetAudio){
        //   myAudio.src = this.data.fid;
        //   myAudio.title = this.data.title;
        // }
        console.log(myAudio);
        console.log([myAudio.src,myAudio.title])
        myAudio.play();
        myAudio.onTimeUpdate(()=>{
            if(that.data.isMoveSlider == false){
              that.setData({
                duration:that.format(myAudio.duration),
                currentTime:that.format(myAudio.currentTime),
                sliderValue:((myAudio.currentTime/myAudio.duration)*100)
            })
            }else{
              that.setData({
                duration:that.format(myAudio.duration),
                currentTime:that.format(myAudio.currentTime)
            })
            }
        });
        myAudio.onEnded(()=>{
          this.setData({
            is_play: true,
            resetAudio:true,
            sliderValue:0,
            currentTime:'00:00'
          })
        })
    }else{
        myAudio.pause()
    }
    this.setData({
        is_play:!this.data.is_play
    })
  },
  sliderChange:function(e){
    var that = this;
    var jindu = e.detail.value*0.01*myAudio.duration;
    myAudio.seek(Number(jindu.toFixed(3)));
    this.setData({
        duration:that.format(myAudio.duration),
        currentTime:that.format(jindu)
    })
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
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onUnload();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var jielongpath = 'pages/audioplay/audioplay?fid=' + this.data.fid + '&title=' + this.data.title;
    return {
      title: this.data.title,
      path: jielongpath,
      success : (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})