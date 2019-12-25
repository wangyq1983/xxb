const myAudio = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play:true,
    fid:'cloud://dev1-vo13f.6465-dev1-vo13f-1300553401/mp3/book/1down/m1_unit1.mp3.mp3',
    title:'m1_unit1',
    duration:'',
    currentTime:'',
    sliderValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myAudio.src = this.data.fid;
    myAudio.title = this.data.title;
    this.audio_play();
  },
  radomNumber:function(){

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
        console.log([this.data.fid,this.data.title])
        console.log([myAudio.src,myAudio.title])
        myAudio.play();
        myAudio.onTimeUpdate(()=>{
            console.log(myAudio.duration);
            console.log(myAudio.currentTime);
            console.log(((myAudio.currentTime/myAudio.duration)*100))
            that.setData({
                duration:that.format(myAudio.duration),
                currentTime:that.format(myAudio.currentTime),
                sliderValue:((myAudio.currentTime/myAudio.duration)*100)
            })
            console.log(this.data.duration);
            console.log(this.data.currentTime);
            console.log(this.data.sliderValue)
        });
        myAudio.onStop(()=>{
            this.reload();
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
    console.log('----------------------------')
    console.log(e.detail.value);
    var jindu = e.detail.value*0.01*myAudio.duration;
    console.log(jindu);
    console.log([jindu.toFixed(3),typeof jindu.toFixed(3)])
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
    
  }
})