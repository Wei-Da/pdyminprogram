// pages/patrolContentHistory/patrolContentHistory.js
var app = getApp();
var pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskDetail: [],
    faultId: '',
    companyId: '',
    pageNo: 0,
    lastTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      faultId: options.faultId,
      companyId: options.companyId,
    });
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
    this.setData({
      taskDetail: [],
      pageNo: 0,
    })
    this.dealTask();
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
  
  },

  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },

  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(res);
      }
    })
  },

  bindtapClick: function (e) {
    console.log(e);
  },

  dealTask: function () {
    var nowTime = new Date().getTime();
    if ((nowTime - this.data.lastTime) < 500) {
      console.log("重复提交")
      return;
    }
    this.setData({
      lastTime: nowTime
    })
    var that = this;
    that.setData({
      pageNo: this.data.pageNo + 1
    })
    var param = { "userId": wx.getStorageSync("userInfo").id, "faultId": this.data.faultId, "pageNo": this.data.pageNo, "pageSize": pageSize };
    app.webCall(app.serviceCode["GET_PATROL_TASK_DETAIL"], param,
      function onSuccess(res) {
        console.log(res);
        that.setData({
          taskDetail: that.data.taskDetail.concat(res.info)
        })
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res);
      },

      "POST")


  },

  onPullDownRefresh: function (e) {
    console.log(e);
    this.setData({
      taskDetail: [],
      pageNo: 0,
    })
    this.dealTask();
  },

  scrollLoading: function (e) {
    console.log(e);
    this.dealTask();
  }
})