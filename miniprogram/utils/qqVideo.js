const qqVideo = {
  
  getVideoes(vid) {
    var that = this;
    var host;
    var pageArr = [];
    var urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
    wx.request({
      url: urlString,
      success: function (res) {
        var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
        var dataJson1 = dataJson.replace(/;qwe/, '');
          var tempStr = JSON.parse(dataJson1);
        // var fn_pre = data.vl.vi[0].lnk
        // host = data['vl']['vi'][0]['ul']['ui'][0]['url']
        // var streams = data['fl']['fi']
        // var seg_cnt = data['vl']['vi'][0]['cl']['fc']
        // if (parseInt(seg_cnt) == 0) {
        //   seg_cnt = 1
        // }
        // var best_quality = streams[streams.length - 1]['name']
        // var part_format_id = streams[streams.length - 1]['id']

          var realurl = tempStr['vl']['vi'][0]['ul']['ui'][0]['url']
              + tempStr['vl']['vi'][0]['fn']
              + "?vkey="
              + tempStr['vl']['vi'][0]['fvkey']
            console.log(realurl);
          return realurl
      }
    })
  },
  // 解析视频真正的地址
};
module.exports = qqVideo